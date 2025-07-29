'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ProjectGrid } from '@/components/dashboard/ProjectGrid'
import { CreateProjectDialog } from '@/components/dashboard/CreateProjectDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import { Project } from '@/types'

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    useEffect(() => {
        if (status === 'loading') return

        if (status === 'unauthenticated') {
            router.push('/auth/signin')
            return
        }

        if (session?.user) {
            fetchProjects()
        }
    }, [session, status, router])

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/projects')

            if (!response.ok) {
                throw new Error('Failed to fetch projects')
            }

            const data = await response.json()
            setProjects(data.data || [])
        } catch (error) {
            console.error('Error fetching projects:', error)
            toast({
                title: "Error",
                description: "Failed to load projects",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateProject = async (projectData: { name: string; description?: string; settings?: any }) => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create project')
            }

            const data = await response.json()

            toast({
                title: "Success",
                description: "Project created successfully",
            })

            // Refresh projects list
            await fetchProjects()

            // Navigate to the new project
            router.push(`/project/${data.data._id}`)
        } catch (error) {
            console.error('Error creating project:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create project",
                variant: "destructive",
            })
        }
    }

    const handleDeleteProject = async (projectId: string) => {
        try {
            const response = await fetch(`/api/projects?id=${projectId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to delete project')
            }

            toast({
                title: "Success",
                description: "Project deleted successfully",
            })

            // Refresh projects list
            await fetchProjects()
        } catch (error) {
            console.error('Error deleting project:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete project",
                variant: "destructive",
            })
        }
    }

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' })
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {session?.user?.name || 'User'}!
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage your visual design projects
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => setShowCreateDialog(true)}
                            className="flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>New Project</span>
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{projects.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {projects.length === 0 ? 'No projects yet' : 'Active projects'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {projects.filter(p => {
                                    const weekAgo = new Date()
                                    weekAgo.setDate(weekAgo.getDate() - 7)
                                    return new Date(p.updatedAt) > weekAgo
                                }).length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Updated in last 7 days
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0 MB</div>
                            <p className="text-xs text-muted-foreground">
                                Project data storage
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading projects...</p>
                        </div>
                    </div>
                ) : (
                    <ProjectGrid
                        projects={projects}
                        onDeleteProject={handleDeleteProject}
                    />
                )}

                {/* Empty State */}
                {!loading && projects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating a new project.
                        </p>
                        <div className="mt-6">
                            <Button onClick={() => setShowCreateDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Project
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Project Dialog */}
            <CreateProjectDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onCreateProject={handleCreateProject}
            />
        </div>
    )
} 