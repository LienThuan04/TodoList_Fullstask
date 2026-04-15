import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ChangesInforProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    name?: string | null;
    email?: string | null;
    onSave: () => void;
    setEmailInput: (email: string) => void;
    setNameInput: (name: string) => void;
}

export default function ChangesInfor({ isOpen, setOpen, name, email, onSave, setEmailInput, setNameInput }: ChangesInforProps) {
    return <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm"> {/*DialogContent là để chứa nội dung dialog*/}
            {/* <form> */}
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription className="text-muted-foreground mb-4">
                    Make changes to your profile here. Click save when you&apos;re
                    done.
                </DialogDescription>
            </DialogHeader>
            <FieldGroup>
                <Field>
                    <Label htmlFor="username-1">Email</Label>
                    <Input id="username-1" name="email" defaultValue={email ?? ""} onChange={(e) => setEmailInput(e.target.value)} />
                </Field>
                <Field>
                    <Label htmlFor="name-1">Name</Label>
                    <Input id="name-1" name="name" defaultValue={name ?? ""} onChange={(e) => setNameInput(e.target.value)} />
                </Field>

            </FieldGroup>
            <DialogFooter className="mt-4">
                <DialogClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button onClick={onSave}>Save changes</Button>
            </DialogFooter>
            {/* </form> */}
        </DialogContent>
    </Dialog>
}