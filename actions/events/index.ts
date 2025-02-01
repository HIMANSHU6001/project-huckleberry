"use server";
import { Event } from "@/types/admin/events";
import { handleError, handleSuccess } from "@/utils";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createEvent(event: Omit<Event, "id">) {
    try {
        const { data, error } = await supabase
            .from("events")
            .insert(event)
            .select()
            .single();
        console.log(data, error);

        if (error) return handleError(error);
        return handleSuccess({
            ...data,
            message: "Event created successfully",
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function getEvent(id: string) {
    try {
        const { data } = await supabase
            .from("events")
            .select()
            .eq("id", id)
            .single();

        if (!data) return handleError({ message: "Event not found" });

        return handleSuccess(data);
    } catch (error) {
        return handleError(error);
    }
}

export async function updateEvent(id: string, updates: Partial<Event>) {
    try {
        const { data, error } = await supabase
            .from("events")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) return handleError(error);
        return handleSuccess({
            ...data,
            message: "Event updated successfully",
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function deleteEvent(id: string) {
    try {
        const { error } = await supabase.from("events").delete().eq("id", id);

        if (error) return handleError(error);
        return handleSuccess({ message: "Event deleted successfully" });
    } catch (error) {
        return handleError(error);
    }
}

export async function getAllEvents() {
    try {
        const { data, error } = await supabase
            .from("events")
            .select()
            .order("timestamp", { ascending: false });

        if (error) return handleError(error);

        return handleSuccess({ data, message: null });
    } catch (error) {
        return handleError(error);
    }
}
