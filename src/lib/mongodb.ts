import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	var mongoose: MongooseCache | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
	global.mongoose = cached;
}

export async function connectDB() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			console.log("MongoDB connected successfully");
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		console.error("MongoDB connection error:", e);
		throw e;
	}

	return cached.conn;
}

export async function disconnectDB() {
	if (cached.conn) {
		await mongoose.disconnect();
		cached.conn = null;
		cached.promise = null;
		console.log("MongoDB disconnected");
	}
}

export function isConnected() {
	return mongoose.connection.readyState === 1;
}
