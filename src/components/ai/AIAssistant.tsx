'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

interface AIAssistantProps {
    projectId: string
    onCommandExecuted: (command: string, result: any) => void
    onElementsGenerated?: (elements: any[]) => void
}

export function AIAssistant({ projectId, onCommandExecuted, onElementsGenerated }: AIAssistantProps) {
    const [prompt, setPrompt] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null)

    async function handlePromptSubmit() {
        if (!prompt.trim()) return

        setIsProcessing(true)
        setLastResult(null)

        try {
            const response = await fetch('/api/ai/process-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    command: prompt.trim(),
                    mode: 'web',
                    projectId
                })
            })

            if (response.ok) {
                const result = await response.json()

                // Call the callback with generated elements
                if (onElementsGenerated && result.elements) {
                    onElementsGenerated(result.elements)
                }

                onCommandExecuted(prompt.trim(), result)
                setPrompt('')
                setLastResult({ success: true, message: result.message || 'Elements created successfully!' })
            } else {
                const errorData = await response.json()
                setLastResult({ success: false, message: errorData.error || 'Failed to process command' })
            }
        } catch (error) {
            console.error('Error processing command:', error)
            setLastResult({ success: false, message: 'Network error occurred' })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handlePromptSubmit()
        }
    }

    return (
        <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>

            <div className="flex-1 flex flex-col justify-end space-y-3">
                <div className="flex space-x-2">
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Describe what you want to draw..."
                        className="flex-1"
                        disabled={isProcessing}
                    />
                    <Button
                        onClick={handlePromptSubmit}
                        disabled={!prompt.trim() || isProcessing}
                        size="sm"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>

                {/* Processing State */}
                {isProcessing && (
                    <div className="text-center text-sm text-blue-500 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        Processing AI command...
                    </div>
                )}

                {/* Result Feedback */}
                {lastResult && (
                    <div className={`text-center text-sm p-2 rounded flex items-center justify-center ${lastResult.success
                        ? 'text-green-600 bg-green-50'
                        : 'text-red-600 bg-red-50'
                        }`}>
                        {lastResult.success ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                        ) : (
                            <AlertCircle className="h-4 w-4 mr-2" />
                        )}
                        {lastResult.message}
                    </div>
                )}

                {/* Quick Commands */}
                <div className="text-xs text-gray-500">
                    <div className="font-medium mb-1">Quick Commands:</div>
                    <div className="space-y-1">
                        <div>• "Draw a red rectangle"</div>
                        <div>• "Create a blue circle"</div>
                        <div>• "Add a green triangle"</div>
                        <div>• "Write hello text"</div>
                        <div>• "Draw a line"</div>
                    </div>
                </div>
            </div>
        </div>
    )
} 