import { getMemberByEmail } from '@/actions/members';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email } = req.body;
  const member = await getMemberByEmail(email);
  return NextResponse.json(member);
}
