import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
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

// Cloudinary upload function
export const uploadToCloudinary = async (image: File): Promise<string> => {
  if (!(image instanceof File)) {
    throw new Error('Invalid image file.');
  }
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = process.env
    .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const form = new FormData();
  form.append('file', image);
  form.append('upload_preset', uploadPreset);
  try {
    const response = await axios.post<{ url: string }>(url, form);
    if (response.status !== 200) {
      throw new Error('Failed to upload image!');
    }
    return response.data.url;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Define the validation schema using Zod
const memberSchema = z.object({
  profile_photo: z.string().optional(), // Make it optional for initial form validation
  user_name: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  mobile_no: z.coerce
    .number({
      required_error: 'Mobile number is required',
      invalid_type_error: 'Mobile number must be a number',
    })
    .refine((val) => {
      const numStr = val.toString();
      return numStr.length === 10;
    }, 'Mobile number must be exactly 10 digits'),
  role: z.string().min(1, 'Role is required'),
  github: z
    .string()
    .url('Enter a valid GitHub URL')
    .optional()
    .or(z.literal('')), // Make GitHub optional, allowing empty string
  linkedin: z
    .string()
    .url('Enter a valid LinkedIn URL')
    .min(1, 'LinkedIn profile is required'),
  twitter: z
    .string()
    .url('Enter a valid Twitter URL')
    .min(1, 'Twitter profile is required'),
  other_socials: z.array(z.string()).default([]),
  caption: z.string().nullable().optional(),
  introduction: z.string().min(1, 'Introduction is required'),
  is_admin: z.boolean().default(false),
  is_super_admin: z.boolean().default(false),
});

type MemberFormSchema = z.infer<typeof memberSchema>;

const MemberRegistrationModal = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEditing = false,
  isLoading = false,
}: MemberRegistrationModalProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const defaultFormValues: Partial<MemberFormData> = {
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

  const form = useForm<MemberFormSchema>({
    resolver: zodResolver(memberSchema),
    defaultValues: defaultValues || defaultFormValues,
  });

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Don't set the form value yet, it will be uploaded on submit
    }
  };

  const handleSubmit = async (data: MemberFormSchema) => {
    try {
      const finalData = { ...data };

      // Check if we're using an existing image or uploading a new one
      if (imageFile) {
        setUploadLoading(true);
        try {
          // Upload the image to Cloudinary
          const imageUrl = await uploadToCloudinary(imageFile);
          // Update the form data with the new image URL
          finalData.profile_photo = imageUrl;
        } catch (error) {
          console.error('Error uploading image:', error);
          return; // Stop submission if image upload fails
        } finally {
          setUploadLoading(false);
        }
      } else if (
        !imageFile &&
        !finalData.profile_photo &&
        !defaultValues?.profile_photo
      ) {
        // No image selected and no existing image
        alert('Please select a profile photo');
        return;
      } else if (!finalData.profile_photo && defaultValues?.profile_photo) {
        // If editing and keeping the existing image
        finalData.profile_photo = defaultValues.profile_photo;
      }

      // Ensure profile_photo is not empty after all checks
      if (!finalData.profile_photo) {
        alert('Profile photo is required');
        return;
      }

      // Submit the form data with the updated profile_photo
      onSubmit(finalData);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  // Set initial image preview if editing and there's an existing URL
  React.useEffect(() => {
    if (defaultValues?.profile_photo) {
      setImagePreview(defaultValues.profile_photo);
      // Pre-set the form field value for editing scenarios
      form.setValue('profile_photo', defaultValues.profile_photo);
    }
  }, [defaultValues, form]);

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
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Profile Photo*</FormLabel>
                    <div className="flex flex-col items-center space-y-4">
                      {imagePreview && (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <FormControl>
                        <div className="flex flex-col items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                          />
                          {/* Hidden input to maintain form state */}
                          <Input type="hidden" {...field} />
                          {isEditing && !imageFile && field.value && (
                            <p className="text-sm text-muted-foreground">
                              Current photo URL: {field.value.substring(0, 30)}
                              ...
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        {isEditing
                          ? 'Upload a new profile photo or keep the existing one.'
                          : 'Upload a profile photo. This is required.'}
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username*</FormLabel>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number*</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value ? parseInt(value, 10) : '');
                        }}
                        value={field.value === 0 ? '' : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Profile</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional: You can leave this blank if not available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile*</FormLabel>
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter Profile*</FormLabel>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Introduction*</FormLabel>
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

              {/* Super Admin toggle is commented out in original code */}
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
              <Button type="submit" disabled={isLoading || uploadLoading}>
                {uploadLoading
                  ? 'Uploading...'
                  : isEditing
                    ? 'Save Changes'
                    : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberRegistrationModal;
