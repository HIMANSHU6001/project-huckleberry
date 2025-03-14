'use server';

import { signIn } from '@/auth';

export async function login() {
  try {
    await signIn('google');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
