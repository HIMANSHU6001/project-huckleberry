"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import Image from "next/image";
import { Plus, Github, Linkedin, Twitter, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import MemberRegistrationModal from "./create-member";

interface Member {
  id: string;
  created_at: string;
  profile_photo: string;
  user_name: string;
  email: string;
  mobile_no: number;
  role: string;
  github: string;
  linkedin: string;
  twitter: string;
  other_socials: string[];
  caption: string | null;
  introduction: string;
  is_admin: boolean;
  is_super_admin: boolean;
}

const MembersDashboard = () => {
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "profile_photo",
      header: "Profile",
      cell: ({ row }) => (
        <div className="relative w-10 h-10">
          <Image
            src={row.original.profile_photo}
            alt={row.original.user_name}
            fill
            className="rounded-full object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "user_name",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mobile_no",
      header: "Mobile",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>,
    },
    {
      accessorKey: "socials",
      header: "Socials",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.github && (
            <a
              href={row.original.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {row.original.linkedin && (
            <a
              href={row.original.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {row.original.twitter && (
            <a
              href={row.original.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
        </div>
      ),
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.is_admin && <Badge variant="secondary">Admin</Badge>}
          {row.original.is_super_admin && (
            <Badge variant="destructive">Super Admin</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(member)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(member.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  

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

  const handleEdit = (member: Member) => {
    setCurrentMember(member);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    setLoading(true);

    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete member");
      console.error(error);
    } else {
      setMembers((prev) => prev.filter((member) => member.id !== id));
      toast.success("Member deleted successfully");
    }

    setLoading(false);
  };

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

      <div className="mt-6">
        {members.length ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>No members found.</p>
        )}
      </div>
    </div>
  );
};

export default MembersDashboard;