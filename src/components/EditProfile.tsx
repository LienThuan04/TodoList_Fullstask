import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Camera, LogOut, Settings, User } from "lucide-react"
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import api from "@/lib/axios";
import { DialogSettings } from "@/components/DialogSettings";
import ChangesInfor from "@/components/ChangesInfor";

interface AvatarDropdownProps {
    /** Element được dùng làm trigger (avatar button) */
    trigger: React.ReactNode;
    name?: string | null;
    email?: string | null;
    id: string | null;
    onChangeAvatar?: () => void;
    onLogout?: () => void;
    fetchAccountInfo: () => void;
}

export function AvatarDropdown({ trigger, name, email, id, onChangeAvatar, onLogout, fetchAccountInfo }: AvatarDropdownProps) {

    const [nameInput, setNameInput] = useState<string>(name ?? "");
    const [emailInput, setEmailInput] = useState<string>(email ?? "");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);

    const handleSave = async () => {
        if (!id) {
            toast.error("User ID is missing");
            return;
        }
        try {
            const response: any = await api.patch(`/users/${id}`, {
                userName: nameInput,
                email: emailInput
            });
            if (response.status === 200) {
                toast.success("Profile updated successfully");
                setIsDialogOpen(false);
                fetchAccountInfo();
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DropdownMenu>
                    {/* asChild = dùng chính element trigger (avatar) làm nút bấm, không bọc thêm */}
                    <DropdownMenuTrigger asChild>
                        {trigger}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="start" sideOffset={8} side="bottom">
                        {/* Header: tên + email */}
                        {(name || email) && (
                            <>
                                <DropdownMenuLabel className="flex flex-col gap-0.5">
                                    {name && <span className="font-semibold text-sm">{name}</span>}
                                    {email && <span className="text-xs text-muted-foreground font-normal truncate">{email}</span>}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                            </>
                        )}

                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={onChangeAvatar} className="cursor-pointer">
                                <Camera className="mr-2 size-4" />
                                Change Avatar
                            </DropdownMenuItem>

                            {/*DialogTrigger là để mở dialog với tư cách là con của DropdownMenuTrigger, nó sẽ kế thừa các props của DropdownMenuTrigger*/}

                            <DropdownMenuItem className="cursor-pointer" onClick={() => setIsDialogOpen(true)}>
                                <User className="mr-2 size-4" />
                                Edit Profile
                            </DropdownMenuItem>


                            <DropdownMenuItem className="cursor-pointer" onClick={() => setIsOpenSettings(true)}>
                                <Settings className="mr-2 size-4" />
                                Settings
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={onLogout}
                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                            <LogOut className="mr-2 size-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Dialog>

            <ChangesInfor
                isOpen={isDialogOpen}
                setOpen={setIsDialogOpen}
                name={name}
                email={email}
                onSave={handleSave}
                setEmailInput={setEmailInput}
                setNameInput={setNameInput}
            />
            <DialogSettings isOpen={isOpenSettings} setOpen={setIsOpenSettings} />
        </>
    )
}