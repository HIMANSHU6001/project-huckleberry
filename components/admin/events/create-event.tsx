import React, { useEffect } from "react";
import { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type EventRegistration = {
    title: string;
    subTitle: string;
    description: string;
    location: string;
    mode: "offline" | "online" | "hybrid";
    eligibility: string;
    timestamp: string;
    coverImage: string;
};

type FieldConfig = {
    name: keyof EventRegistration;
    label: string;
    type: "text" | "textarea" | "select" | "datetime-local";
    placeholder?: string;
    options?: { label: string; value: string }[];
    rules?: Record<string, any>;
    fullWidth?: boolean;
};

const formFields: FieldConfig[] = [
    {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Event title",
        rules: { required: "Title is required" },
    },
    {
        name: "subTitle",
        label: "Subtitle",
        type: "text",
        placeholder: "Event subtitle",
        rules: { required: "Subtitle is required" },
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe your event",
        rules: { required: "Description is required" },
        fullWidth: true,
    },
    {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "Event location",
        rules: { required: "Location is required" },
    },
    {
        name: "mode",
        label: "Mode",
        type: "select",
        options: [
            { label: "Offline", value: "offline" },
            { label: "Online", value: "online" },
            { label: "Hybrid", value: "hybrid" },
        ],
        rules: { required: "Mode is required" },
    },
    {
        name: "timestamp",
        label: "Date and Time",
        type: "datetime-local",
        rules: { required: "Date and time is required" },
    },
    {
        name: "eligibility",
        label: "Eligibility",
        type: "text",
        placeholder: "Who can attend?",
        rules: { required: "Eligibility is required" },
    },
    {
        name: "coverImage",
        label: "Cover Image URL",
        type: "text",
        placeholder: "Image URL",
        rules: { required: "Cover image URL is required" },
        fullWidth: true,
    },
];

interface EventRegistrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: EventRegistration) => void;
    defaultValues?: Partial<EventRegistration>;
    isEditing?: boolean;
}

const EventRegistrationModal = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues,
    isEditing = false,
}: EventRegistrationModalProps) => {
    const form = useForm<EventRegistration>({
        values: {
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
        },
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                title: defaultValues.title || "",
                subTitle: defaultValues.subTitle || "",
                description: defaultValues.description || "",
                location: defaultValues.location || "",
                mode: defaultValues.mode || "offline",
                eligibility: defaultValues.eligibility || "",
                timestamp: defaultValues.timestamp
                    ? new Date(defaultValues.timestamp)
                          .toISOString()
                          .slice(0, 16)
                    : "",
                coverImage: defaultValues.coverImage || "",
            });
        }
    }, [defaultValues, form.reset]);

    const handleSubmit = (data: EventRegistration) => {
        const formattedData = {
            ...data,
            timestamp: new Date(data.timestamp).getTime(),
        };
        onSubmit(formattedData);
        onOpenChange(false);
        form.reset();
    };

    const renderField = (field: FieldConfig) => {
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
                                {field.type === "textarea" ? (
                                    <Textarea
                                        placeholder={field.placeholder}
                                        className="min-h-[100px] resize-none"
                                        {...formField}
                                    />
                                ) : field.type === "select" ? (
                                    <Select
                                        onValueChange={formField.onChange}
                                        defaultValue={formField.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={`Select ${field.label.toLowerCase()}`}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {field.options?.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        {...formField}
                                    />
                                )}
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
                            {formFields.map(renderField)}
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
