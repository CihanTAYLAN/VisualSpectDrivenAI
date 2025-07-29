import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { ProjectMode } from "@/types";

export interface Project {
	_id: string;
	name: string;
	description?: string;
	userId: string;
	currentVersion: number;
	thumbnail?: string;
	settings: {
		defaultMode: ProjectMode;
	};
	createdAt: string;
	updatedAt: string;
}

interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	error?: string;
}

export function useProjects(userId?: string) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProjects = useCallback(async () => {
		if (!userId) return;

		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/projects?userId=${userId}`);
			const result: ApiResponse<Project[]> = await response.json();

			if (result.success) {
				setProjects(result.data);
			} else {
				setError(result.error || "Failed to fetch projects");
				toast({
					title: "Error",
					description: result.error || "Failed to fetch projects",
					variant: "destructive",
				});
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch projects";
			setError(errorMessage);
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}, [userId]);

	const createProject = useCallback(
		async (projectData: {
			name: string;
			description?: string;
			settings?: {
				defaultMode: ProjectMode;
			};
		}) => {
			if (!userId) return null;

			setLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/projects", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...projectData,
						userId,
					}),
				});

				const result: ApiResponse<Project> = await response.json();

				if (result.success) {
					setProjects((prev) => [result.data, ...prev]);
					toast({
						title: "Success",
						description: "Project created successfully",
					});
					return result.data;
				} else {
					setError(result.error || "Failed to create project");
					toast({
						title: "Error",
						description: result.error || "Failed to create project",
						variant: "destructive",
					});
					return null;
				}
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Failed to create project";
				setError(errorMessage);
				toast({
					title: "Error",
					description: errorMessage,
					variant: "destructive",
				});
				return null;
			} finally {
				setLoading(false);
			}
		},
		[userId]
	);

	const updateProject = useCallback(
		async (
			projectId: string,
			updateData: {
				name?: string;
				description?: string;
				settings?: {
					defaultMode?: ProjectMode;
				};
			}
		) => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch(`/api/projects/${projectId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updateData),
				});

				const result: ApiResponse<Project> = await response.json();

				if (result.success) {
					setProjects((prev) => prev.map((project) => (project._id === projectId ? result.data : project)));
					toast({
						title: "Success",
						description: "Project updated successfully",
					});
					return result.data;
				} else {
					setError(result.error || "Failed to update project");
					toast({
						title: "Error",
						description: result.error || "Failed to update project",
						variant: "destructive",
					});
					return null;
				}
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Failed to update project";
				setError(errorMessage);
				toast({
					title: "Error",
					description: errorMessage,
					variant: "destructive",
				});
				return null;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const deleteProject = useCallback(async (projectId: string) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/projects/${projectId}`, {
				method: "DELETE",
			});

			const result: ApiResponse<{ message: string }> = await response.json();

			if (result.success) {
				setProjects((prev) => prev.filter((project) => project._id !== projectId));
				toast({
					title: "Success",
					description: "Project deleted successfully",
				});
				return true;
			} else {
				setError(result.error || "Failed to delete project");
				toast({
					title: "Error",
					description: result.error || "Failed to delete project",
					variant: "destructive",
				});
				return false;
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete project";
			setError(errorMessage);
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	return {
		projects,
		loading,
		error,
		fetchProjects,
		createProject,
		updateProject,
		deleteProject,
	};
}
