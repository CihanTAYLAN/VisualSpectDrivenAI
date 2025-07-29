'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ProjectLayout } from '@/components/project/ProjectLayout'
import { Project, Version } from '@/types'
import { toast } from '@/hooks/use-toast'

export default function ProjectPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session, status } = useSession()
    const [project, setProject] = useState<Project | null>(null)
    const [versions, setVersions] = useState<Version[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'loading') return

        if (status === 'unauthenticated') {
            router.push('/auth/signin')
            return
        }

        if (params.id && session?.user) {
            fetchProject()
        }
    }, [params.id, session, status, router])

    const fetchProject = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/projects?id=${params.id}`)

            if (!response.ok) {
                if (response.status === 404) {
                    toast({
                        title: "Error",
                        description: "Project not found",
                        variant: "destructive",
                    })
                    router.push('/dashboard')
                    return
                }
                throw new Error('Failed to fetch project')
            }

            const data = await response.json()
            setProject(data.data.project)
            setVersions(data.data.versions || [])
        } catch (error) {
            console.error('Error fetching project:', error)
            toast({
                title: "Error",
                description: "Failed to load project",
                variant: "destructive",
            })
            router.push('/dashboard')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-600">Loading project...</p>
                </div>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        return null
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
                    <p className="text-gray-600">The project you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    return (
        <ProjectLayout project={project} versions={versions} />
    )
}