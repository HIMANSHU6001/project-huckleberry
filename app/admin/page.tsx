"use client";

import { Calendar, Layers, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllEvents } from "@/actions/events";
import { getAllMembers } from "@/actions/members";
import { getPublishedRepos } from "@/actions/projects";
import Loader from "@/components/ui/loader";

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

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    upcomingEvents: 0,
    recentProjects: [],
    upcomingEventsList: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [membersResponse, eventsResponse, publishedRepos] =
          await Promise.all([
            getAllMembers(),
            getAllEvents(),
            getPublishedRepos(),
          ]);

        if (
          membersResponse.status !== "success" ||
          eventsResponse.status !== "success"
        ) {
          throw new Error("Failed to fetch data");
        }

        const now = new Date();

        const members = membersResponse.data.data || [];
        const events = eventsResponse.data.events || [];
        const publishedProjects = publishedRepos.data.data || [];

        const upcomingEvents = events.filter(
          (event) => new Date(parseInt(event.timestamp)) > now
        );

        setStats({
          totalMembers: members.length,
          upcomingEvents: upcomingEvents.length,
          recentProjects: publishedProjects.map((project) => ({
            id: project.id,
            name: project.repo_name,
            updatedAt: new Date(project.published_at),
          })),
          upcomingEventsList: upcomingEvents.slice(0, 3).map((event) => ({
            id: event.id,
            title: event.title,
            timestamp: new Date(parseInt(event.timestamp)),
          })),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    link,
    linkText,
  }: {
    title: string;
    value: number | string;
    icon: any;
    link?: string;
    linkText?: string;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-gist text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-gist">
          {isLoading ? <Loader /> : value}
        </div>
      </CardContent>
      {link && linkText && (
        <CardFooter>
          <Button className="px-2 text-sm font-gist text-black hover:no-underline">
            <Link href={link}>{linkText}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-gist mb-8">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 font-geist-sans">
          <StatCard
            title="Published Projects"
            value={stats.recentProjects.length}
            icon={Layers}
            link="/admin/publish-projects"
            linkText="Go to all projects →"
          />
          <StatCard
            title="Team Members"
            value={stats.totalMembers}
            icon={Users}
            link="/admin/members"
            linkText="View all members →"
          />
          <StatCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            icon={Calendar}
            link="/admin/events"
            linkText="View calendar →"
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 font-geist-sans">
          <Card>
            <CardHeader>
              <CardTitle className="font-gist">Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-72 overflow-y-auto">
                {stats.recentProjects.length > 0 ? (
                  stats.recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Layers className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-gist">
                          {project.name
                            .replace(/-/g, " ")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </p>
                        <p className="text-xs font-gist text-muted-foreground">
                          Published {project.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No published projects
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-gist">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.upcomingEventsList.length > 0 ? (
                  stats.upcomingEventsList.map((event) => (
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
                  <p className="text-sm text-muted-foreground">
                    No upcoming events
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
