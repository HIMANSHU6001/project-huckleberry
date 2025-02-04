"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login, signup } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { formFields } from "@/config/auth";
import { toast } from "sonner";
import { ActionType } from "@/types/auth";
import { signInWithGoogle } from "@/utils/supabase/signinwithgoogle";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (action: ActionType) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();
    setLoading(true);
    const response = await action(formData);
    setLoading(false);
    if (response.status === "error") {
      console.error(response);
      toast.error(response.error.message || "An error occurred");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Account Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as "email" | "password"}
                  rules={{
                    required: field.required,
                    pattern: field.pattern,
                    minLength: field.minLength
                  }}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...formField}
                          type={field.type}
                          placeholder={field.placeholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => onSubmit(signup)}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </Button>
          <Button
            onClick={() => onSubmit(login)}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Loading..." : "Log in"}
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setGoogleLoading(!googleLoading);
              signInWithGoogle();
              setGoogleLoading(!googleLoading);
            }}
            className="w-full font-normal"
          >
            Login with google
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
