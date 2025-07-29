'use client';

import { StoreSnapshot, Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { forwardRef, useEffect, useImperativeHandle, useCallback } from 'react';

// Function to validate and fix snapshot structure
export const validateAndFixSnapshot = (snapshot: StoreSnapshot<any> | undefined): StoreSnapshot<any> | undefined => {
    if (!snapshot || !snapshot.store) {
        return snapshot;
    }

    const fixedSnapshot = { ...snapshot };

    // Find and fix document record
    Object.keys(fixedSnapshot.store).forEach(key => {
        const record = fixedSnapshot.store[key];
        if (record) {
            // Ensure meta field exists
            if (!record.meta) {
                fixedSnapshot.store[key] = {
                    ...record,
                    meta: {}
                };
            }
        }
    });

    return fixedSnapshot;
};

// The props for the TldrawWrapper component.
export interface TldrawWrapperProps {
    /**
     * The initial content to load into the editor.
     */
    initialContent?: StoreSnapshot<any>;
    /**
     * A callback function that is called when the editor's content changes.
     * @param content The new content of the editor.
     */
    onChange?: (content: StoreSnapshot<any>) => void;
    setContent?: (content: StoreSnapshot<any>) => void;
    /**
     * Debounce delay in milliseconds for onChange callback.
     * Default is 300ms.
     */
    debounceDelay?: number;
}

// The ref for the TldrawWrapper component, which exposes a `setContent` method.
export interface TldrawWrapperRef {
    /**
     * Sets the content of the tldraw editor.
     * @param content The content to set.
     */
    setContent: (content: StoreSnapshot<any>) => void;
}

/**
 * A wrapper component for the Tldraw editor that provides `onChange` and `setContent` functionality.
 * It also disables the session/multiplayer features by hiding the share menu.
 */
const TldrawWrapper = forwardRef<TldrawWrapperRef, TldrawWrapperProps>(
    ({ initialContent, onChange, debounceDelay = 300 }, ref) => {
        // Validate and fix the initial content before passing to Tldraw
        const validatedContent = validateAndFixSnapshot(initialContent);

        return (
            <div className="h-full w-full">
                <Tldraw
                    // Pass in the validated initial content...
                    snapshot={validatedContent}
                    // Hide the share menu to disable session features by overriding the component with null
                    components={{
                        SharePanel: null,
                        Cursor: null,
                        PageMenu: null,
                    }}
                >
                    <InnerTldrawWrapper onChange={onChange} debounceDelay={debounceDelay} ref={ref} />
                </Tldraw>
            </div>
        );
    }
);

TldrawWrapper.displayName = 'TldrawWrapper';

/**
 * An inner component that has access to the tldraw editor instance.
 * This is necessary because the `useEditor` hook can only be used inside a Tldraw component.
 */
const InnerTldrawWrapper = forwardRef<TldrawWrapperRef, Pick<TldrawWrapperProps, 'onChange' | 'debounceDelay'>>(
    ({ onChange, debounceDelay = 300 }, ref) => {
        let allowOnChange = true;
        const editor = useEditor();

        // Create a debounced onChange callback
        const debouncedOnChange = useCallback(
            (() => {
                let timeoutId: NodeJS.Timeout;
                return (content: StoreSnapshot<any>) => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        onChange?.(content);
                    }, debounceDelay);
                };
            })(),
            [onChange, debounceDelay]
        );

        // Expose the `setContent` method on the ref.
        useImperativeHandle(ref, () => ({
            setContent: (content: StoreSnapshot<any>): void => {
                allowOnChange = false;
                const validatedContent = validateAndFixSnapshot(content);
                if (validatedContent) {
                    editor.store.loadStoreSnapshot({
                        store: validatedContent.store,
                        schema: validatedContent.schema,
                    });
                }
                allowOnChange = true;
            },
        }));

        // Listen for changes to the editor's content and call the `onChange` callback.
        useEffect(() => {
            if (!onChange || !allowOnChange) return;
            // A listener that gets called whenever the editor's content changes.
            const cleanup = editor.store.listen(
                () => {
                    const snapshot = editor.store.getStoreSnapshot();
                    debouncedOnChange(snapshot);
                },
                // Listen to changes to the document (shapes, pages, etc.) from a user's interaction.
                { source: 'user', scope: 'document' }
            );

            return () => {
                cleanup();
            };
        }, [editor, debouncedOnChange]);

        return null;
    }
);

InnerTldrawWrapper.displayName = 'InnerTldrawWrapper'

export default TldrawWrapper;