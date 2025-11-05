import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { toast } from "sonner";
import api from "@lib/axios";
import auth from "@lib/auth";
import { useNavigate } from "react-router";

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [remember, setRemember] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        if (!isEmailValid(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (password.length < 3) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            // Call backend login endpoint. The server returns an object like:
            // { message: 'Login successful', data: { AccessToken: 'eyJ...' } }
            // We call the central `api` instance so it uses the same baseURL
            // and interceptors that we defined.
            const res = await api.post('/api/accounts/login', { email, password });

            // Extract token from response. Based on your API example the token
            // is at res.data.data.AccessToken (capital A). We only check that
            // exact path here to keep things simple and predictable.
            const token = res?.data?.data?.AccessToken ?? null;
            console.log('Login response token:', token);

            // If token is missing, show an error. Do not store non-string data.
            if (!token) {
                toast.error(res?.data?.error || 'Login failed: token missing');
                return;
            }

            // Save token string in localStorage. After this, api interceptors
            // will attach it to future requests and ProtectedRoute will allow
            // navigation because isTokenValid() can parse the JWT payload.
            auth.setToken(token);
            toast.success(res?.data?.message || 'Login successful');

            // Redirect the user to the protected home route.
            navigate('/', { replace: true });
        } catch (error: any) {
            // On network/server error show a toast and log details for debugging.
            console.error(error);
            const msg = error?.response?.data?.error ? error?.response?.data?.error : error?.response?.data?.message ? error?.response?.data?.message : 'Login failed';
            toast.error(msg);
        }
        // console.log({ email, password, remember });
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
                                            value={email as string}
                                            onChange={(e) => setEmail(e.target.value as string)}
                                            placeholder="you@example.com"
                                            aria-label="Email"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Password</label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                value={password as string}
                                                onChange={(e) => setPassword(e.target.value as string)}
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
                                                checked={remember as boolean}
                                                onChange={(e) => setRemember(e.target.checked as boolean)}
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