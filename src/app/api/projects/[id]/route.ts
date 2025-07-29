import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { z } from "zod";
import { ProjectMode } from "../../../../types";

// Validation schemas
const updateProjectSchema = z.object({
	name: z.string().min(1, "Project name is required").max(100, "Project name too long").optional(),
	description: z.string().optional(),
	settings: z
		.object({
			defaultMode: z.enum(Object.values(ProjectMode) as [string, ...string[]]).optional(),
		})
		.optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		await connectDB();

		const project = await Project.findById(params.id).lean();

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: project,
		});
	} catch (error) {
		console.error("Error fetching project:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate input
		const validatedData = updateProjectSchema.parse(body);

		const project = await Project.findById(params.id);

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Update project
		Object.assign(project, validatedData);
		project.updatedAt = new Date();

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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		await connectDB();

		const project = await Project.findById(params.id);

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		await Project.findByIdAndDelete(params.id);

		return NextResponse.json({
			success: true,
			message: "Project deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting project:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
