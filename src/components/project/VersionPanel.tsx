'use client'

import { Version } from '@/types'
import { Calendar } from 'lucide-react'

interface VersionPanelProps {
    versions: Version[]
    currentVersion: Version
    onVersionSelect: (version: Version) => void
}

export function VersionPanel({ versions, currentVersion, onVersionSelect }: VersionPanelProps) {
    return (
        <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Version History</h3>

            <div className="flex-1 overflow-y-auto">
                {versions.map((version) => (
                    <div
                        key={version._id}
                        className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${currentVersion._id === version._id
                            ? 'bg-blue-100 border-blue-300 border'
                            : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                        onClick={() => onVersionSelect(version)}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">Version {version.version}</span>
                            <span className="text-xs text-gray-500 capitalize">{version.mode}</span>
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                        </div>

                        {version.changelog && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {version.changelog}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
} 