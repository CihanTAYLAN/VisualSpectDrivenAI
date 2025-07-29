import { Schema, model, models } from "mongoose";
import { StoreSnapshot } from "tldraw";

const versionSchema = new Schema({
	projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
	version: { type: Number, required: true },
	canvasData: {
		type: Schema.Types.Mixed,
		required: true,
		// tldraw snapshot formatı için
		validate: {
			validator: function (v: StoreSnapshot) {
				return v && typeof v === "object" && v.store && v.schema;
			},
			message: "Canvas data must be a valid tldraw snapshot",
		},
	},
	changelog: String,
	aiCommands: [
		{
			command: String,
			timestamp: { type: Date, default: Date.now },
			result: String,
		},
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
versionSchema.pre("save", function (next) {
	this.updatedAt = new Date();
	next();
});

export const Version = models.Version || model("Version", versionSchema);
