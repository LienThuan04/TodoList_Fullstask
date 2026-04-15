import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface DialogDemoProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

export function DialogSettings({ isOpen, setOpen }: DialogDemoProps) {
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


    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-4xl" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Customize your preferences here.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="change-password" className="w-full">
                    <TabsList>
                        <TabsTrigger value="change-password">Change Password</TabsTrigger>
                        <TabsTrigger value="coming-soon">Comming Soon</TabsTrigger>
                    </TabsList>
                    <TabsContent value="change-password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Change your password regularly to enhance account security and avoid risks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <form onSubmit={handleChangePassword}>
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
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="coming-soon">
                        <Card>
                            <CardHeader>
                                <CardTitle>Coming Soon</CardTitle>
                                <CardDescription>
                                    We are working hard to bring you new features. Stay tuned for updates!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                We are excited to announce that new features will be available soon. Thank you for your patience and support!
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                {/* Footer */}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline"
                            onClick={() => {
                                setOpen(false);
                                resetform();
                            }}
                        >Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
