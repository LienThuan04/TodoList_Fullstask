import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import type { AxiosInstance } from "axios";

interface ChangesInforProps {
    api: AxiosInstance;
}

export default function FieldChangePass( { api }: ChangesInforProps) {

    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const resetform = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }


    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields", { position: "top-center", closeButton: false });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match", { position: "top-center", closeButton: false });
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters", { position: "top-center", closeButton: false });
            return;
        }
        try {
            // Call API to change password
            const res = await api.post('/auth/change-password', {
                oldPassword: currentPassword,
                newPassword: newPassword
            });
            if (res?.status === 200 || res.status === 201 || res.status === 204) {
                toast.success(res?.data?.message || "Password changed successfully", { position: "top-center", closeButton: false });
                // Reset form
                resetform();
                return;
            }
        } catch (error: any) {
            console.error("Change password error:", error);

            // Handle error response from server
            if (error?.response?.status === 400) {
                toast.error(error?.response?.data?.message || "Invalid password", { position: "top-center", closeButton: false });
            } else if (error?.response?.status === 401) {
                toast.error("Your current password is incorrect", { position: "top-center", closeButton: false });
            } else if (error?.response?.status === 500) {
                toast.error("Server error. Please try again later", { position: "top-center", closeButton: false });
            } else {
                toast.error(error?.response?.data?.message || "Failed to change password", { position: "top-center", closeButton: false });
            }
        }
    }

    return <form onSubmit={handleChangePassword}>
        <FieldGroup>
            <Field>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="••••••" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </Field>
            <Field>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="••••••" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Field>
            <Field>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Field>
        </FieldGroup>
        <Button type="submit" className="mt-5 ">Save Changes</Button>
    </form>
}