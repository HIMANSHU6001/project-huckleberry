import React from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { EventRegistration, FieldConfig } from "@/types/admin/events";
import { formFields } from "@/config/admin/events";
import { FormFieldComponent } from "./form-fields";

interface EventRegistrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: EventRegistration) => void;
    defaultValues?: Partial<EventRegistration> | null;
    isEditing?: boolean;
}

const getInitialValues = (
    defaultValues?: Partial<EventRegistration> | null
): EventRegistration => ({
    title: defaultValues?.title || "",
    subTitle: defaultValues?.subTitle || "",
    description: defaultValues?.description || "",
    location: defaultValues?.location || "",
    mode: defaultValues?.mode || "offline",
    eligibility: defaultValues?.eligibility || "",
    timestamp: defaultValues?.timestamp
        ? new Date(defaultValues.timestamp).toISOString().slice(0, 16)
        : "",
    coverImage: defaultValues?.coverImage || "",
});

const EventRegistrationModal = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues,
    isEditing = false,
}: EventRegistrationModalProps) => {
    const form = useForm<EventRegistration>({
        values: getInitialValues(defaultValues),
    });

    const handleSubmit = (data: EventRegistration) => {
        const formattedData = {
            ...data,
            timestamp: new Date(data.timestamp).getTime().toString(),
        };
        onSubmit(formattedData);
        onOpenChange(false);
        form.reset();
    };

    const renderFormField = (field: FieldConfig) => {
        const FieldComponent =
            FormFieldComponent[field.type as keyof typeof FormFieldComponent] ||
            FormFieldComponent.default;

        return (
            <div
                key={field.name}
                className={field.fullWidth ? "col-span-2" : "col-span-1"}
            >
                <FormField
                    control={form.control}
                    name={field.name}
                    rules={field.rules}
                    render={({ field: formField }) => (
                        <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                                <FieldComponent
                                    {...formField}
                                    placeholder={field.placeholder}
                                    type={field.type}
                                    options={field.options}
                                    label={field.label}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Event" : "Create New Event"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Make changes to your event here. Click save when you're done."
                            : "Fill in the details for your new event."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {formFields.map(renderFormField as any)}
                        </div>

                        <DialogFooter>
                            <Button type="submit">
                                {isEditing ? "Save Changes" : "Create Event"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EventRegistrationModal;
