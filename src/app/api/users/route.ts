import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { ProjectMode } from "../../../types";

// Validation schemas
const createUserSchema = z.object({
	email: z.string().email("Invalid email address"),
	name: z.string().min(1, "Name is required").max(100, "Name too long"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	image: z.string().url().optional(),
	preferences: z
		.object({
			defaultMode: z.enum(Object.values(ProjectMode) as [string, ...string[]]).default(ProjectMode.WEB),
			microphoneEnabled: z.boolean().default(true),
			autoSave: z.boolean().default(true),
		})
		.optional(),
});

const updateUserSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
	image: z.string().url().optional(),
	preferences: z
		.object({
			defaultMode: z.enum(Object.values(ProjectMode) as [string, ...string[]]).optional(),
			microphoneEnabled: z.boolean().optional(),
			autoSave: z.boolean().optional(),
		})
		.optional(),
});

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const email = searchParams.get("email");

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const user = await User.findOne({ email }).select("-password").lean();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: user,
		});
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate input
		const validatedData = createUserSchema.parse(body);

		// Check if user already exists
		const existingUser = await User.findOne({ email: validatedData.email });
		if (existingUser) {
			return NextResponse.json({ error: "User already exists" }, { status: 409 });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(validatedData.password, 12);

		const user = new User({
			...validatedData,
			password: hashedPassword,
			preferences: validatedData.preferences || {
				defaultMode: ProjectMode.WEB,
				microphoneEnabled: true,
				autoSave: true,
			},
		});

		await user.save();

		// Return user without password
		const userResponse = user.toObject();
		delete userResponse.password;

		return NextResponse.json(
			{
				success: true,
				data: userResponse,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating user:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const email = searchParams.get("email");

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const body = await request.json();

		// Validate input
		const validatedData = updateUserSchema.parse(body);

		const user = await User.findOne({ email });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Update user
		Object.assign(user, validatedData);
		await user.save();

		// Return user without password
		const userResponse = user.toObject();
		delete userResponse.password;

		return NextResponse.json({
			success: true,
			data: userResponse,
		});
	} catch (error) {
		console.error("Error updating user:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
