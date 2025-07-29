import Link from 'next/link'
import { Project } from '@/types'
import { Calendar, Clock, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProjectCardProps {
    project: Project
    onDeleteProject: (projectId: string) => Promise<void>
}

export function ProjectCard({ project, onDeleteProject }: ProjectCardProps) {
    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
            await onDeleteProject(project._id)
        }
    }

    return (
        <Link href={`/project/${project._id}`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer relative group">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>

                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {project.name}
                        </h3>
                        {project.description && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {project.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                            {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>v{project.currentVersion}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
} 