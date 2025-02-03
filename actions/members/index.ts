"use server";
import { Member } from "@/types/admin/members/supabase";
import { handleError, handleSuccess } from "@/utils";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getAllMembers() {
    try {
        const { data, error } = await supabase
            .from("members")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) return handleError(error);
        return handleSuccess({
            data: data || [],
            message: "Members fetched successfully",
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function createMember(member: Member) {
    try {
        const { error } = await supabase
            .from("members")
            .insert([member])
            .select()
            .single();

        if (error) return handleError(error);
        return handleSuccess({
            ...member,
            message: "Member created successfully",
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function updateMember(member: Member) {
    try {
        const { error } = await supabase
            .from("members")
            .update(member)
            .eq("id", member.id);

        if (error) return handleError(error);
        return handleSuccess({
            ...member,
            message: "Member updated successfully",
        });
    } catch (error) {
        return handleError(error);
    }
}
