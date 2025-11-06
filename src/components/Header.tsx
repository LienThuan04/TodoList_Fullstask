import { useEffect, useRef, useState } from "react";
import auth from "@lib/auth";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import api, { domain } from "@/lib/axios";

const Header = () => {
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [avatarUser, setAvatarUser] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchAvatar = async () => {
        try {
            const res = await api.get('/api/accounts/avatar');
            if(res?.data?.data?.avatar){
                setAvatarUser(res.data.data.avatar);
            }
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    };

    const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const req = await api.post("/api/accounts/avatar", formData,{
                headers: { "Content-Type": "multipart/form-data" }
            } );
            if(!req?.data?.data){
                toast.error(req?.data?.message || "Failed to update avatar");
            }
            fetchAvatar();
            toast.success(req?.data?.message || "Avatar updated successfully");
        } catch (error) {
            console.error("Error updating avatar:", error);
            toast.error("Failed to update avatar");
        }
    };

    useEffect(() => {
        fetchAvatar();
    }, []);

    useEffect(() => {
        try {
            const token: string | null = auth.getToken();
            const payload: any = auth.parseJwt(token);
            if (payload) {
                // try several common claim names
                const foundName = payload?.name ?? payload.fullName ?? payload.username ?? null;
                const foundEmail = payload.email ?? payload.sub ?? null;
                setName(foundName ?? null);
                setEmail(foundEmail ?? null);
            }
        } catch (e) {
            // ignore parse errors
            setName(null);
            setEmail(null);
            console.error("Failed to parse JWT token:", e);
        }
    }, []);

    const initials = name
        ? name
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : null;

    const doLogout = () => {
        try {
            auth.removeToken();
        } catch (e) {
            /* ignore */
            console.error("Error during logout:", e);
        }
        toast.success("You have been logged out.");
        setTimeout(() => {
            if (typeof window !== "undefined") window.location.href = "/login";
        }, 500);

    };

    return (
        <header className="w-full bg-transparent py-6">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-sky-400">Todo Fullstack</h1>
                            <p className="text-xs sm:text-sm text-muted-foreground">Manage your tasks efficiently and effortlessly</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {name || email ? (
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-block p-0 border-0 bg-transparent rounded-full"
                                        aria-label="Change avatar"
                                    >
                                        {avatarUser ? (
                                            <img
                                                src={
                                                    typeof avatarUser === "string"
                                                        ? `${domain}/avatars/${avatarUser}`
                                                        : `${domain}/avatars/default.png`
                                                }
                                                alt="User Avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-medium">
                                                {initials ?? "U"}
                                            </div>
                                        )}
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleChangeAvatar(e)}
                                    />
                                </div>
                                <div className="text-right hidden sm:block">
                                    {name && <div className="text-lg font-medium text-transparent bg-gradient-to-r bg-clip-text from-fuchsia-500 to-sky-500">{name}</div>}
                                    {email && <div className="text-xs text-muted-foreground" >{email}</div>}
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" aria-label="Logout">
                                            <LogOut className="size-4 mr-2" />
                                            <span className="hidden sm:inline">Logout</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Confirm logout</DialogTitle>
                                            <DialogDescription>Are you sure you want to log out? You will need to sign in again to access your tasks.</DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="ghost">Cancel</Button>
                                            </DialogClose>
                                            <Button
                                                variant="gradient"
                                                onClick={() => doLogout()}
                                            >
                                                Yes, logout
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">Guest</div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;