import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// MongoDB utility functions
export function isValidObjectId(id: string): boolean {
	const objectIdPattern = /^[0-9a-fA-F]{24}$/;
	return objectIdPattern.test(id);
}

export function formatMongoError(error: any): string {
	if (error.code === 11000) {
		return "Duplicate entry found";
	}
	if (error.name === "ValidationError") {
		return Object.values(error.errors)
			.map((err: any) => err.message)
			.join(", ");
	}
	return error.message || "An error occurred";
}

// API response helpers
export function createSuccessResponse(data: any, message?: string) {
	return {
		success: true,
		data,
		message,
		timestamp: new Date().toISOString(),
	};
}

export function createErrorResponse(message: string, status: number = 500) {
	return {
		success: false,
		error: message,
		timestamp: new Date().toISOString(),
		status,
	};
}

// Validation helpers
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function sanitizeString(str: string): string {
	return str.trim().replace(/[<>]/g, "");
}

// Date helpers
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

export function isRecentDate(date: Date, hours: number = 24): boolean {
	const now = new Date();
	const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
	return diffInHours <= hours;
}
