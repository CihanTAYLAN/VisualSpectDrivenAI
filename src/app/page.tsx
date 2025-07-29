'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/useSession'

export default function HomePage() {
    const { user, isAuthenticated, isLoading } = useSession()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Visual Spect Driven AI
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Spec-driven development assistant with AI-powered voice commands
                    </p>
                    <div className="space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link href="/dashboard">
                                    <Button size="lg">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                                <p className="mt-4 text-sm text-gray-600">
                                    Welcome back, {user?.name}!
                                </p>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/signin">
                                    <Button size="lg">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button variant="outline" size="lg">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 