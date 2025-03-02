import { formatProjectName } from '@/utils/dashboard-function';
import { Layers } from 'lucide-react';

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

export const RecentProjectsList = ({
  projects,
}: {
  projects: DashboardStats['recentProjects'];
}) => (
  <div className="space-y-4 h-72 overflow-y-auto">
    {projects.length > 0 ? (
      projects.map((project) => (
        <div key={project.id} className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
            <Layers className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-gist">
              {formatProjectName(project.name)}
            </p>
            <p className="text-xs font-gist text-muted-foreground">
              Published {project.updatedAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-muted-foreground">No published projects</p>
    )}
  </div>
);
