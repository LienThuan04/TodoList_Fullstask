import { useEffect, useRef, useState } from "react";
import auth from "@lib/auth";
import { toast } from "sonner";
import api from "@lib/axios";
import reactLogo from "@/assets/react.svg";
import { AvatarDropdown } from "@/components/Settings/TabEditProfile";

const Header = () => {
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [avatarUser, setAvatarUser] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const fetchId = async () => {
        try {
            const res = await api.post('/auth/account-info');
            if(res?.data?.user?._id){
                setId(res?.data?.user?._id);
            } else {
                toast.error(res?.data?.message || "Account info fetched successfully");
            }
        } catch (error) {
            console.error("Error fetching id:", error);
            setId(null);
        }
    };

    const fetchAccountInfo = async () => {
        if (!id) return; // Dừng lại nếu id chưa có (tránh gọi /users/null)

        try {
            const inforUser = await api.get(`/users/${id}`);
            // Note: API trả về { message: "...", data: user } theo users.controller.ts
            const user = inforUser?.data?.data || inforUser?.data?.user;
            if (user) {
                // Lấy thông tin user
                setAvatarUser(user.avatar ?? null);
                setId(user._id ?? null);
                
                const foundName = user.name ?? user.fullName ?? user.userName ?? null;
                const foundEmail = user.email ?? user.sub ?? null;
                
                setName(foundName);
                setEmail(foundEmail);
            }
        } catch (error) {
            console.error("Error fetching account info:", error);
            setName(null);
            setEmail(null);
            setId(null);
            setAvatarUser(null);
        }
    };

    const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append("file", file);
            const req = await api.post("/files/upload-avatar", formData,{
                headers: { "Content-Type": "multipart/form-data" }
            } );
            if(!req?.data?.data){
                toast.error(req?.data?.message || "Failed to update avatar");
            }
            fetchAccountInfo();
            toast.success(req?.data?.message || "Avatar updated successfully");
        } catch (error) {
            console.error("Error updating avatar:", error);
            toast.error("Failed to update avatar");
        }
    };

    useEffect(() => {
        fetchId();
    }, []);

    useEffect(() => {
        fetchAccountInfo();
    }, [id]);

    const doLogout = async () => {
        try {
            // Clear cookies by calling logout endpoint
            await api.post("/auth/logout").catch((error) => {
                console.error("Error calling logout endpoint:", error);
            });
            auth.removeToken();
            // Clear browser cookies
            auth.clearCookies();
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
        <header className="w-full bg-transparent py-3 sm:py-6">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-2 sm:gap-6">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-sky-400 truncate">Todo Fullstack</h1>
                            <p className="text-xs sm:text-sm text-muted-foreground hidden xs:block">Manage your tasks efficiently and effortlessly</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {name || email ? (
                            <div className="flex items-center gap-3">
                                {/* hidden file input – triggered by dropdown menu item */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleChangeAvatar(e)}
                                />

                                {/* Avatar = trigger cho dropdown */}
                                <AvatarDropdown
                                    fetchAccountInfo={fetchAccountInfo}
                                    name={name}
                                    email={email}
                                    id={id}
                                    onChangeAvatar={() => fileInputRef.current?.click()}
                                    onLogout={doLogout}
                                    trigger={
                                        <button
                                            type="button"
                                            className="inline-block p-0 border-0 bg-transparent rounded-full cursor-pointer ring-2 ring-transparent hover:ring-blue-400 transition-all duration-200"
                                            aria-label="Open user menu"
                                        >
                                            <img
                                                src={avatarUser || reactLogo}
                                                alt="User Avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        </button>
                                    }
                                />

                                <div className="text-right hidden sm:block">
                                    {name && <div className="text-lg font-medium text-transparent bg-gradient-to-r bg-clip-text from-fuchsia-500 to-sky-500">{name}</div>}
                                    {email && <div className="text-xs text-muted-foreground">{email}</div>}
                                </div>
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