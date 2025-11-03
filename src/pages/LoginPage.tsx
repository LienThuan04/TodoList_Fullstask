import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        // TODO: replace with real auth call
        console.log({ email, password, remember });
        toast.success("Login successful (stub)");
    }

    return (
        <div className="min-h-screen w-full relative">
            {/* Radial Gradient Background from Top */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)",
                }}
            />
            <div className="flex items-center justify-center text-white py-32 z-10 relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle className="text-3xl font-bold text-transparent bg-primary bg-clip-text pb-2">Login</CardTitle>
                                    <CardDescription>Log in to your Todo system</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Email</label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            aria-label="Email"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••"
                                                aria-label="Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                                            >
                                                {showPassword ? "hide" : "show"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="inline-flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={remember}
                                                onChange={(e) => setRemember(e.target.checked)}
                                                className="h-4 w-4 rounded border bg-background text-primary"
                                            />
                                            <span>Remember Me</span>
                                        </label>
                                        <a href="#" className="text-sm text-primary hover:underline">
                                            Forgot Password?
                                        </a>
                                    </div>

                                    <div>
                                        <Button type="submit" className="w-full">
                                            Login
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full text-center text-sm text-muted-foreground">
                                    Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default LoginPage;