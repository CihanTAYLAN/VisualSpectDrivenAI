import { Schema, model, models } from "mongoose";
import { ProjectMode } from "@/types";

const projectSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	name: { type: String, required: true },
	description: String,
	currentVersion: { type: Number, default: 1 },
	thumbnail: String,
	settings: {
		defaultMode: { type: String, default: ProjectMode.WEB },
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const Project = models.Project || model("Project", projectSchema);
