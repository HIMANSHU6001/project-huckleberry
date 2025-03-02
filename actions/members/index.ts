'use server';
import { prisma } from '@/lib/prisma';
import { handleError, handleSuccess } from '@/utils';
import { Member } from '@/types/admin/members';

export async function getAllMembers() {
  try {
    const data = await prisma.member.findMany({
      orderBy: { created_at: 'desc' },
    });
    return handleSuccess({
      data: data || [],
      message: 'Members fetched successfully',
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function createMember(member: Member) {
  try {
    const newMember = await prisma.member.create({
      data: member,
    });
    return handleSuccess({
      newMember,
      message: 'Member created successfully',
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function updateMember(member: Member) {
  try {
    const updatedMember = await prisma.member.update({
      where: { id: member.id },
      data: member,
    });
    return handleSuccess({
      ...updatedMember,
      message: 'Member updated successfully',
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteMember(id: string) {
  try {
    await prisma.member.delete({ where: { id } });
    return handleSuccess({ message: 'Member deleted successfully' });
  } catch (error) {
    return handleError(error);
  }
}
