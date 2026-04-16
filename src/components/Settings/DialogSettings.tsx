import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { useState } from "react";
import { toast } from "sonner";
import FieldChangesInfor from "@/components/Settings/FieldChangesInfor";
import type { AxiosInstance } from "axios";
import FieldChangePass from "./FieldChangePass";

interface DialogDemoProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    id: string | null;
    api: AxiosInstance;
    name?: string | null;
    email?: string | null;
    FetchInfor: () => void;
}

export function DialogSettings({ isOpen, setOpen, id, api, name, email, FetchInfor }: DialogDemoProps) {


    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-4xl" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Customize your preferences here.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="Change-information" className="w-full">
                    <TabsList>
                        <TabsTrigger value="Change-information">Change Information</TabsTrigger>
                        <TabsTrigger value="change-password">Change Password</TabsTrigger>
                        <TabsTrigger value="coming-soon">Comming Soon</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Change-information">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Information Gmail and User Name</CardTitle>
                                <CardDescription>
                                    Update your email address and username at any time.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <FieldChangesInfor id={id} api={api} name={name} email={email} FetchInfor={FetchInfor} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="change-password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Change your password regularly to enhance account security and avoid risks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                <FieldChangePass api={api}/>
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
                            }}
                        >Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
