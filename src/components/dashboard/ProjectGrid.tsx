import { Project } from '@/types'
import { ProjectCard } from './ProjectCard'

interface ProjectGridProps {
    projects: Project[]
    onDeleteProject: (projectId: string) => Promise<void>
}

export function ProjectGrid({ projects, onDeleteProject }: ProjectGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard
                    key={project._id}
                    project={project}
                    onDeleteProject={onDeleteProject}
                />
            ))}
        </div>
    )
} 