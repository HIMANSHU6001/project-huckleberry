"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { supabase } from "@/utils/supabase/signinwithgoogle";
// import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // console.log("Starting authentication process");
        const { data, error } = await supabase.auth.getSession();

        // console.log("Session data:", data);
        // console.log("Session error:", error);

        if (error) {
          console.error("Supabase session error:", error);
          router.push("/login");
          return;
        }

        if (!data?.session) {
          console.error("No valid session found");
          router.push("/login");
          return;
        }
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;
        // console.log("Access Token:", accessToken);

        try {
          // console.log("hi");
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`,
            {
              token: accessToken,
              refreshToken
            },
            {
              headers: {
                "Content-Type": "application/json"
              },
              withCredentials: true
            }
          );

          // console.log("Backend response:", response.data);
          // console.log("cookies set:", document.cookie);

          if (response.data?.user && response.data?.user.isAdmin) {
            // console.log("hiiii");
            router.push("/dashboard");
            toast(
              `isAdminStatus: ${response.data?.user.isAdmin}, welcome Admin`
            );
          } else {
            router.push("/login");
            toast(
              `isAdminStatus: ${response.data?.user.isAdmin}, not the admin`
            );
          }
        } catch (axiosError) {
          const error = axiosError as AxiosError;

          console.error(
            "Axios request error:",
            error.response?.data || error.message
          );
          router.push("/login");
        }
      } catch (err) {
        console.error("Overall authentication error:", err);
        router.push("/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <p>Authenticating...</p>
        <p className="text-sm text-gray-500">
          Please wait while we verify your session
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
