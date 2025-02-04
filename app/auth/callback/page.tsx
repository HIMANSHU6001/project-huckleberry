"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { supabase } from "@/utils/supabase/signinwithgoogle";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Extensive logging for debugging
        console.log("Starting authentication process");

        // Get session with more detailed error handling
        const { data, error } = await supabase.auth.getSession();

        console.log("Session data:", data);
        console.log("Session error:", error);

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

        // Log the access token
        const accessToken = data.session.access_token;
        console.log("Access Token:", accessToken);

        try {
          // Use full URL for local development
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`,
            {
              token: accessToken
            },
            {
              headers: {
                "Content-Type": "application/json"
                // Optional: Add any additional headers if needed
              },
              withCredentials: true // Important for cookie handling
            }
          );

          console.log("Backend response:", response.data);

          // Handle successful authentication
          if (response.data?.user) {
            router.push("/dashboard");
          } else {
            router.push("/login");
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
