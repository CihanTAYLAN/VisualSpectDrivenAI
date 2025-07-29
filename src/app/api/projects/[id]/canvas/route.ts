import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Version } from "@/models/Version";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		// Authentication check
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
		}

		// Database connection
		await connectDB();

		// Get project
		const project = await Project.findById(params.id);
		if (!project) {
			return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
		}

		// Check if user owns the project
		if (project.userId.toString() !== session.user.id) {
			return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
		}

		// Get current version
		const currentVersion = await Version.findOne({
			projectId: params.id,
			version: project.currentVersion,
		});

		if (!currentVersion) {
			return NextResponse.json({
				success: true,
				data: {
					canvasData: null,
					version: null,
				},
			});
		}

		return NextResponse.json({
			success: true,
			data: {
				canvasData: currentVersion.canvasData,
				version: currentVersion,
			},
		});
	} catch (error) {
		console.error("Error fetching canvas:", error);
		return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
	}
}
