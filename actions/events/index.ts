"use server";
import { Event } from "@/types/admin/events";
import { EventOperationError, handleError, handleSuccess } from "@/utils";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createEvent(event: Omit<Event, "id">) {
    try {
        console.log("Creating event");

        const { data, error } = await supabase
            .from("events")
            .insert(event)
            .select()
            .single();

        if (error) throw new EventOperationError(error.message, 400);

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
        const { data, error } = await supabase
            .from("events")
            .select()
            .eq("id", id)
            .single();

        if (error) throw new EventOperationError(error.message, 404);
        if (!data) throw new EventOperationError("Event not found", 404);

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

        if (error) throw new EventOperationError(error.message, 400);
        if (!data) throw new EventOperationError("Event not found", 404);

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

        if (error) throw new EventOperationError(error.message, 400);

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

        if (error) throw new EventOperationError(error.message, 400);

        return handleSuccess({ data, message: null });
    } catch (error) {
        return handleError(error);
    }
}
