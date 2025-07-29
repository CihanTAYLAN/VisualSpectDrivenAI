export interface User {
	_id: string;
	email: string;
	name: string;
	image?: string;
	createdAt: Date;
	preferences: {
		defaultMode: ProjectMode;
		microphoneEnabled: boolean;
		autoSave: boolean;
	};
}

export enum ProjectMode {
	WEB = "web",
	MOBILE = "mobile",
	DATABASE = "database",
	ARCHITECTURE = "architecture",
}

export interface Project {
	_id: string;
	userId: string;
	name: string;
	description?: string;
	currentVersion: number;
	thumbnail?: string;
	settings: {
		defaultMode: ProjectMode;
	};
	createdAt: string;
	updatedAt: string;
}

export interface Version {
	_id: string;
	projectId: string;
	version: number;
	canvasData: any;
	changelog?: string;
	aiCommands: Array<{
		command: string;
		timestamp: Date;
		result: string;
	}>;
	createdAt: Date;
	updatedAt: Date;
}

export interface AICommand {
	command: string;
	mode: string;
	projectId: string;
	currentCanvas?: any;
}

export interface AIResponse {
	elements: any[];
	message: string;
	success: boolean;
}
