export type Event = {
    id: string;
    coverImage: string;
    title: string;
    subTitle?: string;
    description: string;
    location?: string;
    mode: "offline" | "online" | "hybrid";
    eligibility: string;
    timestamp: string;
};

export type EventRegistration = Omit<Event, "id">;

export type FieldConfig = {
    name: keyof EventRegistration;
    label: string;
    type: "text" | "textarea" | "select" | "datetime-local";
    placeholder?: string;
    options?: { label: string; value: string }[];
    rules?: Record<string, string | number | boolean>;
    fullWidth?: boolean;
};
