"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { FormData } from "@/types/auth";

export async function login(formData: FormData) {
    const supabase = await createClient();
    const data = {
        email: formData.email,
        password: formData.password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return {
            status: "error",
            error: error,
        };
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();
    const data = {
        email: formData.email,
        password: formData.password,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return {
            status: "error",
            error: error,
        };
    }

    revalidatePath("/", "layout");
    redirect("/");
}
