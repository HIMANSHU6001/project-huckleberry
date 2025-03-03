'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from '@/auth';

export default function LoginPage() {
  return (
    <section className="flex items-center justify-center min-h-screen ">
      <Button variant="outline" onClick={() => signIn('google')}>
        <FcGoogle className="w-5 h-5" />
        <span>Continue with Google</span>
      </Button>
    </section>
  );
}
