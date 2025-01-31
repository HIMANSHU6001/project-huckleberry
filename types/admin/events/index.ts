export type Event = {
    id: string;
    coverImage: string;
    title: string;
    subTitle?: string;
    description: string;
    location?: string;
    mode: "offline" | "online";
    eligibility: string;
};
