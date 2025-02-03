"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { Plus} from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberRegistrationModal from "./create-member";
import { Member } from "@/types/admin/members/supabase";
import MemberTable from "@/components/admin/members/MemberTable";

const MembersDashboard = () => {
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch members");
        console.error(error);
      } else {
        setMembers(data || []);
      }
      setLoading(false);
    };
    fetchMembers();
  }, [supabase]);

  const handleSubmit = async (data: Partial<Member>) => {
    setLoading(true);

    try {
      if (currentMember) {
        const { error } = await supabase
          .from("members")
          .update(data)
          .eq("id", currentMember.id);

        if (error) throw error;

        setMembers((prev) =>
          prev.map((member) =>
            member.id === currentMember.id ? { ...member, ...data } : member
          )
        );
        toast.success("Member updated successfully");
      } else {
        const { data: newMember, error } = await supabase
          .from("members")
          .insert([data])
          .select()
          .single();

        if (error) throw error;

        setMembers((prev) => [...prev, newMember]);
        toast.success("Member created successfully");
      }

      setOpen(false);
      setCurrentMember(null);
    } catch (error) {
      toast.error("An error occurred while saving the member");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-5xl font-semibold my-4 font-geist-sans">Members</h1>

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

      <MemberTable members={members} setMembers={setMembers} setCurrentMember={setCurrentMember} setOpen={setOpen} setLoading={setLoading}/>
    </div>
  );
};

export default MembersDashboard;
