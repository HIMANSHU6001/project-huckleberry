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
    const memberData = { ...member };
    if (memberData.id) {
      const existingMember = await prisma.member.findUnique({
        where: { id: memberData.id },
      });
      if (existingMember) {
        return updateMember(memberData);
      }
    }

    const newMember = await prisma.member.create({
      data: memberData,
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
    if (!id || typeof id !== 'string') {
      console.error('Invalid member ID for deletion:', id);
      return handleError(new Error('Valid member ID is required for deletion'));
    }

    const memberId = String(id);

    const existingMember = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!existingMember) {
      return handleError(new Error('Member not found'));
    }

    await prisma.member.delete({
      where: { id: memberId },
    });

    return handleSuccess({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Server: Error deleting member:', error);
    return handleError(error);
  }
}
