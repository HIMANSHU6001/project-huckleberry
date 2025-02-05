import { Calendar } from "lucide-react";

interface DashboardStats {
    totalMembers: number;
    upcomingEvents: number;
    recentProjects: Array<{
      id: string;
      name: string;
      updatedAt: Date;
    }>;
    upcomingEventsList: Array<{
      id: string;
      title: string;
      timestamp: Date;
    }>;
  }

export const UpcomingEventsList = ({
    events,
  }: {
    events: DashboardStats["upcomingEventsList"];
  }) => (
    <div className="space-y-4">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-gist">{event.title}</p>
              <p className="text-xs font-gist text-muted-foreground">
                {event.timestamp.toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No upcoming events</p>
      )}
    </div>
  );