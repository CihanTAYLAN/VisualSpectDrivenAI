'use client'

import { Version } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEffect, forwardRef } from 'react';
import { validateAndFixSnapshot } from '../tldraw/TldrawWrapper';

interface VersionPreviewModalProps {
    version: Version | null
    isOpen: boolean
    onClose: () => void
    onRestore: (version: Version) => void
}

// Inner component that has access to the tldraw editor instance
const PreviewContent = forwardRef<any, { version: Version | null }>(
    ({ version }, ref) => {
        const editor = useEditor();

        // Load version content when version changes
        useEffect(() => {
            if (version?.canvasData && editor) {
                const validatedContent = validateAndFixSnapshot(version.canvasData);
                if (validatedContent) {
                    try {
                        editor.store.loadStoreSnapshot({
                            store: validatedContent.store,
                            schema: validatedContent.schema,
                        });
                        // Zoom to fit content
                        editor.zoomToFit();
                    } catch (error) {
                        console.error('Error loading version snapshot:', error);
                    }
                }
            }
        }, [version, editor]);

        return null;
    }
);

PreviewContent.displayName = 'PreviewContent';

export function VersionPreviewModal({ version, isOpen, onClose, onRestore }: VersionPreviewModalProps) {
    if (!version) return null;

    // Validate and fix the version canvas data before passing to Tldraw
    const validatedContent = validateAndFixSnapshot(version.canvasData);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        Version {version.version} - Preview
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 relative">
                    <div className="h-full w-full">
                        <Tldraw
                            // Pass in the validated initial content
                            snapshot={validatedContent}
                            cameraOptions={{
                                zoomSteps: [1],
                            }}
                            // Hide the share menu and other UI elements to disable session features
                            components={{
                                SharePanel: null,
                                Cursor: null,
                                PageMenu: null,
                            }}
                            // Make it read-only for preview
                            inferDarkMode
                        >
                            <PreviewContent version={version} />
                        </Tldraw>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button onClick={() => onRestore(version)}>
                        Restore this Version
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}