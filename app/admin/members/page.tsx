"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberRegistrationModal from "../../../components/admin/members/create-member";
import { Member } from "@/types/admin/members/supabase";
import MemberTable from "@/components/admin/members/MemberTable";
import { createMember, getAllMembers, updateMember } from "@/actions/members";
import { withLoadingToast } from "@/utils";
import { ApiResponse } from "@/types/commons";

const MembersDashboard = () => {
    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [currentMember, setCurrentMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            const result = await getAllMembers();
            if (result.status === "success" && "data" in result) {
                setMembers(result?.data as unknown as Member[]);
            }
            setLoading(false);
        };
        fetchMembers();
    }, []);

    const handleSubmit = withLoadingToast(
        async (data: Partial<Member>): Promise<ApiResponse> => {
            setLoading(true);
            const result = currentMember
                ? await updateMember(data as Member)
                : await createMember(data as Member);

            if (result.status === "success" && "data" in result) {
                setMembers((prev) =>
                    currentMember
                        ? prev.map((member) =>
                              member.id === currentMember.id
                                  ? { ...member, ...data }
                                  : member
                          )
                        : [...prev, result.data]
                );
                toast.success(
                    currentMember
                        ? "Member updated successfully"
                        : "Member created successfully"
                );
            } else if (result.status === "error" && "message" in result) {
                toast.error(result.message);
            }
            setLoading(false);
            setOpen(false);
            setCurrentMember(null);
            return result;
        }
    );

    return (
        <div className="p-8">
            <h1 className="text-5xl font-semibold my-4 font-geist-sans">
                Members
            </h1>

            <MemberRegistrationModal
                open={open}
                onOpenChange={() => setOpen(false)}
                onSubmit={handleSubmit}
                defaultValues={currentMember}
                isEditing={Boolean(currentMember)}
                isLoading={loading}
            />

            <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2" /> Add Member
            </Button>

            <MemberTable
                members={members}
                setMembers={setMembers}
                setCurrentMember={setCurrentMember}
                setOpen={setOpen}
                setLoading={setLoading}
            />
        </div>
    );
};

export default MembersDashboard;
