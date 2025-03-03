'use client';
import React from 'react';
import { loginWithGoogle } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  return (
    <section className="flex items-center justify-center min-h-screen ">
      <Button variant="outline" onClick={loginWithGoogle}>
        <FcGoogle className="w-5 h-5" />
        <span>Continue with Google</span>
      </Button>
    </section>
  );
}
