import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	image: String,
	password: String, // For credentials provider
	createdAt: { type: Date, default: Date.now },
	preferences: {
		defaultMode: { type: String, default: "web" },
		microphoneEnabled: { type: Boolean, default: true },
		autoSave: { type: Boolean, default: true },
	},
});

export const User = models.User || model("User", userSchema);
