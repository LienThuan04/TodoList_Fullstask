import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AxiosInstance } from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface FieldChangesInforProps {
    id: string | null;
    api: AxiosInstance;
    name?: string | null;
    email?: string | null;
    FetchInfor: () => void;
}

export default function FieldChangesInfor({ id, api, name, email, FetchInfor }: FieldChangesInforProps) {
    const [nameInput, setNameInput] = useState<string>(name ?? "???");
    const [emailInput, setEmailInput] = useState<string>(email ?? "???");

    const resetForm = () => {
        FetchInfor();
        setNameInput(name ?? "???");
        setEmailInput(email ?? "???");
    }


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
                toast.success(`${response.data.message || "Profile updated successfully!"}`);
                resetForm();
                return;
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    return <form onSubmit={(e) => {
        e.preventDefault();
        handleSave();
    }}>
        <FieldGroup>
            <Field>
                <Label htmlFor="username-1">Email</Label>
                <Input id="username-1" name="email" defaultValue={emailInput ?? ""} onChange={(e) => setEmailInput(e.target.value)} />
            </Field>
            <Field>
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" defaultValue={nameInput ?? ""} onChange={(e) => setNameInput(e.target.value)} />
            </Field>
        </FieldGroup>
        <Button type="submit" className="mt-5 ">Save Changes</Button>
    </form>

}