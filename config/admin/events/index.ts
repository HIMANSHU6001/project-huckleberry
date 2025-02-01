import { FieldConfig } from "@/types/admin/events";

export const formFields: FieldConfig[] = [
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

export const demoEvents = [
    {
        id: "1",
        coverImage: "/api/placeholder/400/200",
        title: "Tech Conference 2025",
        subTitle: "Future of AI",
        description: "Join us for an exciting discussion on AI advancement",
        location: "San Francisco",
        mode: "hybrid",
        eligibility: "All tech enthusiasts",
        timestamp: new Date("2025-03-15T10:00:00").getTime(),
    },
    {
        id: "2",
        coverImage: "/api/placeholder/400/200",
        title: "Design Workshop",
        subTitle: "UI/UX Fundamentals",
        description: "Learn the basics of UI/UX design",
        location: "New York",
        mode: "offline",
        eligibility: "Beginners welcome",
        timestamp: new Date("2025-04-20T14:00:00").getTime(),
    },
];

export const columns = [
    { key: "title", label: "Title" },
    { key: "location", label: "Location" },
    { key: "mode", label: "Mode" },
    {
        key: "timestamp",
        label: "Day and Date",
        format: (value: string) =>
            new Date(value).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
    },
];
