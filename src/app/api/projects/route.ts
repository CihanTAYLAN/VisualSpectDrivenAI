import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Version } from "@/models/Version";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProjectMode } from "../../../types";

// Validation schemas
const createProjectSchema = z.object({
	name: z.string().min(1, "Project name is required").max(100, "Project name too long"),
	description: z.string().optional(),
	settings: z
		.object({
			defaultMode: z.enum(Object.values(ProjectMode) as [string, ...string[]]).default(ProjectMode.WEB),
		})
		.optional(),
});

const updateProjectSchema = z.object({
	name: z.string().min(1, "Project name is required").max(100, "Project name too long").optional(),
	description: z.string().optional(),
	settings: z
		.object({
			defaultMode: z.enum(Object.values(ProjectMode) as [string, ...string[]]).optional(),
		})
		.optional(),
});

// GET - Get all projects for the authenticated user
export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get("id");

		if (projectId) {
			// Get specific project
			const project = await Project.findById(projectId).lean();
			if (!project) {
				return NextResponse.json({ error: "Project not found" }, { status: 404 });
			}

			// Get versions for this project
			const versions = await Version.find({ projectId }).sort({ version: -1 }).lean();

			return NextResponse.json({
				success: true,
				data: { project, versions },
			});
		} else {
			// Get all projects for user
			const projects = await Project.find({ userId: session.user.id }).sort({ updatedAt: -1 }).lean();

			return NextResponse.json({
				success: true,
				data: projects,
			});
		}
	} catch (error) {
		console.error("Error fetching projects:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// POST - Create new project
export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();

		// Validate input
		const validatedData = createProjectSchema.parse(body);

		// Create project
		const project = new Project({
			...validatedData,
			userId: session.user.id,
			settings: validatedData.settings || {
				defaultMode: ProjectMode.WEB,
			},
		});

		await project.save();

		// Create initial version
		const initialVersion = new Version({
			projectId: project._id,
			version: 1,
			canvasData: {
				store: {
					"document:document": {
						gridSize: 10,
						name: "",
						id: "document:document",
						typeName: "document",
					},
					"page:page": {
						id: "page:page",
						name: "Page 1",
						index: "a1",
						typeName: "page",
					},
				},
				schema: {
					schemaVersion: 2,
					sequences: {
						"com.tldraw.store": 4,
						"com.tldraw.asset": 1,
						"com.tldraw.camera": 1,
						"com.tldraw.document": 2,
						"com.tldraw.instance": 25,
						"com.tldraw.instance_page_state": 5,
						"com.tldraw.page": 1,
						"com.tldraw.instance_presence": 6,
						"com.tldraw.pointer": 1,
						"com.tldraw.shape": 4,
						"com.tldraw.asset.bookmark": 2,
						"com.tldraw.asset.image": 5,
						"com.tldraw.asset.video": 5,
						"com.tldraw.shape.group": 0,
						"com.tldraw.shape.text": 3,
						"com.tldraw.shape.bookmark": 2,
						"com.tldraw.shape.draw": 2,
						"com.tldraw.shape.geo": 10,
						"com.tldraw.shape.note": 9,
						"com.tldraw.shape.line": 5,
						"com.tldraw.shape.frame": 1,
						"com.tldraw.shape.arrow": 6,
						"com.tldraw.shape.highlight": 1,
						"com.tldraw.shape.embed": 4,
						"com.tldraw.shape.image": 5,
						"com.tldraw.shape.video": 4,
						"com.tldraw.binding.arrow": 1,
					},
				},
			},
			changelog: "Initial version",
			aiCommands: [],
		});

		await initialVersion.save();

		// Update project with current version
		project.currentVersion = 1;
		await project.save();

		return NextResponse.json(
			{
				success: true,
				data: project,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating project:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// PUT - Update project
export async function PUT(request: NextRequest) {
	try {
		await connectDB();

		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get("id");

		if (!projectId) {
			return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
		}

		const body = await request.json();

		// Validate input
		const validatedData = updateProjectSchema.parse(body);

		// Find and update project
		const project = await Project.findOne({ _id: projectId, userId: session.user.id });

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Update project
		Object.assign(project, validatedData, { updatedAt: new Date() });
		await project.save();

		return NextResponse.json({
			success: true,
			data: project,
		});
	} catch (error) {
		console.error("Error updating project:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
	try {
		await connectDB();

		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const projectId = searchParams.get("id");

		if (!projectId) {
			return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
		}

		// Find and delete project
		const project = await Project.findOne({ _id: projectId, userId: session.user.id });

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Delete all versions for this project
		await Version.deleteMany({ projectId });

		// Delete project
		await Project.findByIdAndDelete(projectId);

		return NextResponse.json({
			success: true,
			message: "Project deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting project:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
