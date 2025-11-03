import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RegisterPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function validate() {
        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Confirm password does not match");
            return false;
        }
        return true;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        // TODO: call registration API here
        console.log({ fullName, email, password });
        toast.success("Registration successful (stub)");
        // Optionally clear form or redirect
    }

    return (
        <div className="min-h-screen w-full relative">
            {/* Radial Gradient Background from Bottom */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
                }}
            />
            {/* Your Content/Components */}
            <div className="flex items-center justify-center text-white py-32 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle className="text-3xl font-bold text-transparent bg-primary bg-clip-text pb-2">Register</CardTitle>
                                    <CardDescription>Create an account to manage your todos</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Full Name</label>
                                        <Input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Your full name"
                                            aria-label="Full Name"
                                        />
                                    </div>

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
                                                placeholder="••••••••"
                                                aria-label="Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <Button type="submit" className="w-full">
                                            Register
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full text-center text-sm text-muted-foreground">
                                    Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default RegisterPage;
