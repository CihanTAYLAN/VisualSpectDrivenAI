import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Version } from "@/models/Version";
import { z } from "zod";

// Validation schemas
const createVersionSchema = z.object({
	canvasData: z.any(),
	changelog: z.string().optional(),
	aiCommands: z
		.array(
			z.object({
				command: z.string(),
				timestamp: z.date().optional(),
				result: z.string().optional(),
			})
		)
		.optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "10");
		const page = parseInt(searchParams.get("page") || "1");

		// Check if project exists
		const project = await Project.findById(params.id);
		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		const versions = await Version.find({ projectId: params.id })
			.sort({ version: -1 })
			.limit(limit)
			.skip((page - 1) * limit)
			.lean();

		const total = await Version.countDocuments({ projectId: params.id });

		return NextResponse.json({
			success: true,
			data: versions,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching versions:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		await connectDB();

		// Check if project exists
		const project = await Project.findById(params.id);
		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		const body = await request.json();

		// Validate input
		const validatedData = createVersionSchema.parse(body);

		// Get next version number
		const lastVersion = await Version.findOne({ projectId: params.id }).sort({ version: -1 }).select("version");

		const nextVersion = lastVersion ? lastVersion.version + 1 : 1;

		const version = new Version({
			projectId: params.id,
			version: nextVersion,
			...validatedData,
		});

		await version.save();

		// Update project's current version
		project.currentVersion = nextVersion;
		project.updatedAt = new Date();
		await project.save();

		return NextResponse.json(
			{
				success: true,
				data: version,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating version:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
