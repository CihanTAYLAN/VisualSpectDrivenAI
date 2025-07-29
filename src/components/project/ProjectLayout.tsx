'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import TldrawWrapper, { TldrawWrapperRef } from '../tldraw/TldrawWrapper';
import { ProjectNavigation } from './ProjectNavigation';
import { VersionPanel } from './VersionPanel';
import { VersionPreviewModal } from './VersionPreviewModal';
import { Project, Version } from '@/types';
import { type StoreSnapshot } from 'tldraw';
import { toast } from '@/hooks/use-toast';

interface ProjectLayoutProps {
    project: Project
    versions: Version[]
}

export function ProjectLayout({ project, versions: initialVersions }: ProjectLayoutProps) {
    const [versions, setVersions] = useState<Version[]>(initialVersions)
    const [currentVersion, setCurrentVersion] = useState<Version | null>(null)
    const [loading, setLoading] = useState(true)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    const tldrawRef = useRef<TldrawWrapperRef>(null)
    const [error, setError] = useState<string | null>(null)

    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
    const [selectedVersionForPreview, setSelectedVersionForPreview] = useState<Version | null>(null)

    // Load canvas data from MongoDB
    useEffect(() => {
        const loadCanvasData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/projects/${project._id}/canvas`)

                if (!response.ok) {
                    throw new Error('Failed to load canvas data')
                }

                const result = await response.json()
                if (result.success && result.data.canvasData) {
                    tldrawRef.current?.setContent(result.data.canvasData)
                    console.log('Loaded canvas data from database:', result.data.canvasData)
                } else {
                    console.log('No canvas data found, starting with empty canvas')
                }
            } catch (err) {
                console.error('Error loading canvas data:', err)
                toast({
                    title: "Error",
                    description: "Failed to load canvas data",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        if (project._id) {
            loadCanvasData()
        }
    }, [project._id])

    const handleChange = useCallback((snapshot: StoreSnapshot<any>) => {
        try {
            console.log('Saving canvas snapshot:', snapshot)
            console.log(snapshot);
            setSaveStatus('saving')
            fetch('/api/projects/' + project._id + '/versions', {
                method: 'POST',
                body: JSON.stringify({
                    canvasData: snapshot,
                    changelog: 'Auto saved',
                    aiCommands: []
                })
            }).then((res) => res.json()).then((res) => {
                setCurrentVersion(res.data)
                setVersions(prev => [res.data, ...prev])
                setSaveStatus('saved')
            }).catch((err) => {
                setSaveStatus('error')
            })
        } catch (err) {
            console.error('Error saving canvas:', err)
            setError(err instanceof Error ? err.message : 'Error saving canvas')
        }
    }, [])

    const handleVersionSelect = useCallback((version: Version) => {
        setSelectedVersionForPreview(version)
        setIsPreviewModalOpen(true)
    }, [])


    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-red-50">
                <div className="text-center">
                    <div className="text-red-600 mb-4">⚠️</div>
                    <p className="text-red-600 mb-2">Error in Project Layout</p>
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    // Show loading if loading canvas data
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading canvas data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Navigation Bar */}
            <ProjectNavigation projectName={project.name} saveStatus={saveStatus} />

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Left Panel - tldraw (70%) */}
                <div className="w-[70%] border-r bg-gray-50">
                    <TldrawWrapper
                        ref={tldrawRef}
                        onChange={handleChange}
                    />
                </div>

                {/* Right Panel (30%) */}
                <div className="w-[30%] flex flex-col bg-white">
                    {/* Version History */}
                    <div className="flex-1 flex flex-col min-h-0 border-b">
                        <VersionPanel
                            versions={versions}
                            currentVersion={currentVersion || initialVersions[0]}
                            onVersionSelect={handleVersionSelect}
                        />
                    </div>

                    {/* AI Assistant */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* <AIAssistant
                            projectId={project._id}
                            onCommandExecuted={handleCommandExecuted}
                            onElementsGenerated={handleElementsGenerated}
                        /> */}
                    </div>
                </div>
            </div>

            <VersionPreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                version={selectedVersionForPreview}
                onRestore={(version) => { console.log('restore', version) }}
            />
        </div>
    )
}