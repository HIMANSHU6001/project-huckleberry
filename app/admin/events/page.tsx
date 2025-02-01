"use client";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Event, EventRegistration } from "@/types/admin/events";
import EventRegistrationModal from "@/components/admin/events/create-event";
import { demoEvents, columns } from "@/config/admin/events";
import { uploadToCloudinary, upsertEvent, withLoadingToast } from "@/utils";

import { createEvent, updateEvent } from "@/actions/events";
import { ApiResponse } from "@/types/commons";

const EventsDashboard = () => {
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState(demoEvents);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        event: Event | null;
    }>({
        open: false,
        event: null,
    });

    const [loading, setLoading] = useState(false);

    const handleEdit = (event: Event) => {
        setOpen(true);
        setCurrentEvent(event);
    };

    const handleDelete = (event: Event) => {
        setDeleteDialog({ open: true, event });
    };

    const confirmDelete = () => {
        if (deleteDialog.event) {
            setEvents(events.filter((e) => e.id !== deleteDialog.event?.id));
        }
        setDeleteDialog({ open: false, event: null });
    };

    const handleSubmit = withLoadingToast(
        async (data: Partial<Event>): Promise<ApiResponse> => {
            setLoading(true);

            const coverImage = data?.coverImage?.[0]
                ? await uploadToCloudinary(data.coverImage[0])
                : null;

            const eventData: EventRegistration = {
                ...data,
                coverImage,
            } as EventRegistration;
            const result = currentEvent
                ? await updateEvent(currentEvent.id, eventData)
                : await createEvent(eventData);

            if (result.status === "success") {
                setEvents((prevEvents) =>
                    upsertEvent(prevEvents, data, currentEvent?.id)
                );
                setOpen(false);
                setCurrentEvent(null);
            }

            console.log(result);
            setLoading(false);

            return result;
        }
    );

    const handleClose = () => {
        setOpen(false);
        setCurrentEvent(null);
    };

    return (
        <div className="p-8 font-geist-sans">
            <EventRegistrationModal
                open={open}
                onOpenChange={handleClose}
                onSubmit={handleSubmit}
                defaultValues={currentEvent}
                isEditing={Boolean(currentEvent)}
                isLoading={loading}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Events Dashboard</h1>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => setOpen(true)}
                >
                    <Plus className="h-4 w-4" /> Add Event
                </Button>
            </div>

            <DataTable
                // @ts-expect-error - Demo data is not paginated
                columns={columns}
                // @ts-expect-error - Demo data is not paginated
                data={events}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    !open && setDeleteDialog({ open, event: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete&nbsp;&apos;
                            {deleteDialog.event?.title}&nbsp;&apos; ? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({ open: false, event: null })
                            }
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EventsDashboard;
