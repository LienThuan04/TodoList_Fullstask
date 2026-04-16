import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Camera, LogOut, Settings } from "lucide-react"
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import api from "@/lib/axios";
import { DialogSettings } from "@/components/Settings/DialogSettings";

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

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);



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
            <DialogSettings isOpen={isOpenSettings} setOpen={setIsOpenSettings} id={id} api={api} name={name} email={email} FetchInfor={fetchAccountInfo} />
        </>
    )
}