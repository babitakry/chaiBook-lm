"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { BookOpen, Sparkles, Loader2, ArrowLeft } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();
    const { data: session, isPending: sessionLoading } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If already logged in, redirect to dashboard
    if (session?.user) {
        router.push("/");
    }

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            await signIn.social({
                provider: "google",
                callbackURL: window.location.origin,
            });
        } catch (err: any) {
            setError(err?.message || "Failed to initiate Google sign in.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

            {/* Top Navigation */}
            <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group focus:outline-none"
                >
                    <div className="size-9 rounded-xl bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                        <BookOpen className="size-4" />
                    </div>
                    <span className="font-heading font-extrabold text-base tracking-tight">
                        ChaiBook
                    </span>
                </Link>

                <ModeToggle />
            </header>

            {/* Main Center Card */}
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-card/70 backdrop-blur-xl border-border/60 shadow-2xl shadow-primary/5 rounded-[28px] p-2">
                    <CardHeader className="text-center space-y-2 pb-6">
                        <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary mb-1">
                            <Sparkles className="size-6" />
                        </div>
                        <CardTitle className="text-2xl font-extrabold tracking-tight font-heading">
                            Welcome to ChaiBook
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                            Sign in to access your AI notebooks, upload sources, and generate quizzes & summaries.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            onClick={handleGoogleSignIn}
                            disabled={loading || sessionLoading}
                            variant="outline"
                            className="w-full h-11 rounded-2xl border-border/80 bg-background/80 hover:bg-muted font-medium text-sm gap-3 shadow-sm hover:shadow transition-all"
                        >
                            {loading ? (
                                <Loader2 className="size-4 animate-spin text-primary" />
                            ) : (
                                <svg
                                    className="size-4"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            )}
                            <span>Continue with Google</span>
                        </Button>
                    </CardContent>

                    <CardFooter className="pt-4 border-t border-border/40 text-center justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="size-3" />
                            <span>Back to homepage</span>
                        </Link>
                    </CardFooter>
                </Card>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-xs text-muted-foreground">
                <p>Secured with Better Auth</p>
            </footer>
        </div>
    );
}
