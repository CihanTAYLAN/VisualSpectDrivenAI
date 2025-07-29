'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LogOut, Home, Save, CheckCircle, AlertCircle } from 'lucide-react'

interface ProjectNavigationProps {
    projectName: string
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error'
}

export function ProjectNavigation({ projectName, saveStatus = 'idle' }: ProjectNavigationProps) {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' })
    }

    const handleDashboard = () => {
        router.push('/dashboard')
    }

    // Save status icon component
    const getSaveStatusIcon = () => {
        switch (saveStatus) {
            case 'saving':
                return (
                    <div className="flex items-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">Saving...</span>
                    </div>
                )
            case 'saved':
                return (
                    <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Saved</span>
                    </div>
                )
            case 'error':
                return (
                    <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Save Error</span>
                    </div>
                )
            default:
                return (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Save className="h-4 w-4" />
                        <span className="text-sm font-medium">All changes saved</span>
                    </div>
                )
        }
    }

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDashboard}
                    className="flex items-center space-x-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Dashboard</span>
                </Button>
                <div className="text-sm text-gray-500">|</div>
                <h1 className="text-lg font-semibold text-gray-900">{projectName}</h1>
            </div>

            <div className="flex items-center space-x-4">
                {/* Save Status */}
                {getSaveStatusIcon()}

                <div className="text-sm text-gray-500">|</div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDashboard}
                        className="flex items-center space-x-2"
                    >
                        <Home className="h-4 w-4" />
                        <span>Dashboard</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}