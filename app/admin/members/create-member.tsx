import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  MemberFormData,
  MemberRegistrationModalProps,
} from '@/types/admin/members/supabase';
import { roleOptions } from '@/config/admin/members/constants';

const MemberRegistrationModal = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEditing = false,
  isLoading = false,
}: MemberRegistrationModalProps) => {
  const defaultFormValues: MemberFormData = {
    profile_photo: '',
    user_name: '',
    email: '',
    mobile_no: 0,
    role: 'developer',
    github: '',
    linkedin: '',
    twitter: '',
    other_socials: [],
    caption: '',
    introduction: '',
    is_admin: false,
    is_super_admin: false,
  };

  const form = useForm<MemberFormData>({
    defaultValues: defaultValues || defaultFormValues,
  });

  const handleSubmit = (data: MemberFormData) => {
    const formattedData = {
      ...data,
      mobile_no: Number(data.mobile_no),
    };
    onSubmit(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl font-geist-sans h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Member' : 'Add New Member'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to member information here. Click save when you're done."
              : 'Fill in the details for the new member.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="profile_photo"
                rules={{ required: 'Profile photo URL is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_name"
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile_no"
                rules={{ required: 'Mobile number is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="github"
                  rules={{ required: 'GitHub profile is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Profile</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin"
                  rules={{ required: 'LinkedIn profile is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  rules={{ required: 'Twitter profile is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Profile</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="introduction"
                rules={{ required: 'Introduction is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Introduction</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Administrative Settings</h3>
              <FormField
                control={form.control}
                name="is_admin"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Admin Status</FormLabel>
                      <FormDescription>
                        Grant admin privileges to this user
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* <FormField
                  control={form.control}
                  name="is_super_admin"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Super Admin Status</FormLabel>
                        <FormDescription>
                          Grant super admin privileges
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isEditing ? 'Save Changes' : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberRegistrationModal;
