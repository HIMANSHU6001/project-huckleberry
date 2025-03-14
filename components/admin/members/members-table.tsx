import { deleteMember } from '@/actions/members';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Member } from '@/types/admin/members';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Github, Linkedin, Pencil, Trash2, Twitter } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const MemberTable = ({
  members,
  setMembers,
  setCurrentMember,
  setOpen,
  setLoading,
}: {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  setCurrentMember: React.Dispatch<React.SetStateAction<Member | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: 'profile_photo',
      header: 'Profile',
      cell: ({ row }) => (
        <div className="relative w-10 h-10">
          {/* eslint-disable-next-line */}
          <img
            src={row.original.profile_photo}
            alt={row.original.user_name}
            className="rounded-full object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: 'user_name',
      header: 'Username',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'mobile_no',
      header: 'Mobile',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>,
    },
    {
      accessorKey: 'socials',
      header: 'Socials',
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
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.is_admin && <Badge variant="secondary">Admin</Badge>}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
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

  const handleEdit = (member: Member) => {
    setCurrentMember(member);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error('Member ID is missing');
      return;
    }

    if (!confirm('Are you sure you want to delete this member?')) return;
    setLoading(true);

    try {
      const result = await deleteMember(id);
      if (result.status === 'success') {
        setMembers((prev) => prev.filter((member) => member.id !== id));
        toast.success('Member deleted successfully');
      } else {
        toast.error(result.status || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('An error occurred while deleting the member');
    } finally {
      setLoading(false);
    }
  };

  return (
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
                    data-state={row.getIsSelected() && 'selected'}
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
  );
};

export default MemberTable;
