"use client";

import { Calendar, Layers, Users, Twitter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getAllEvents } from "@/actions/events";
import { getAllMembers } from "@/actions/members";
import { getPublishedRepos } from "@/actions/projects";
import { getTotalTweetCount } from "@/actions/tweets";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { RecentProjectsList } from "@/components/admin/dashboard/RecentPorjectList";
import { UpcomingEventsList } from "@/components/admin/dashboard/UpcomingEventList";
import { ErrorDisplay } from "@/components/admin/dashboard/ErrorComponent";
import {
    filterUpcomingEvents,
    mapUpcomingEvents,
    mapPublishedProjects,
} from "@/utils/dashboard-function";

interface DashboardStats {
    totalMembers: number;
    upcomingEvents: number;
    tweetCount: number;
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
        tweetCount: 0,
        recentProjects: [],
        upcomingEventsList: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    membersResponse,
                    eventsResponse,
                    publishedRepos,
                    tweetCountResponse,
                ] = await Promise.all([
                    getAllMembers(),
                    getAllEvents(),
                    getPublishedRepos(),
                    getTotalTweetCount(),
                ]);

                if (
                    membersResponse.status !== "success" ||
                    eventsResponse.status !== "success"
                ) {
                    throw new Error("Failed to fetch data");
                }

                const members =
                    "data" in membersResponse ? membersResponse.data.data : [];
                const events =
                    "data" in eventsResponse ? eventsResponse.data.events : [];
                const publishedProjects =
                    "data" in publishedRepos
                        ? publishedRepos.data.data.map((project: any) => ({
                              ...project,
                              published_at: project.published_at.toISOString(),
                          }))
                        : [];

                const upcomingEvents = filterUpcomingEvents(events);

                setStats({
                    totalMembers: members.length,
                    upcomingEvents: upcomingEvents.length,
                    tweetCount: tweetCountResponse,
                    recentProjects: mapPublishedProjects(publishedProjects),
                    upcomingEventsList: mapUpcomingEvents(upcomingEvents),
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

    if (error) {
        return <ErrorDisplay message={error} />;
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
                        isLoading={isLoading}
                    />
                    <StatCard
                        title="Team Members"
                        value={stats.totalMembers}
                        icon={Users}
                        link="/admin/members"
                        linkText="View all members →"
                        isLoading={isLoading}
                    />
                    <StatCard
                        title="Upcoming Events"
                        value={stats.upcomingEvents}
                        icon={Calendar}
                        link="/admin/events"
                        linkText="View calendar →"
                        isLoading={isLoading}
                    />
                    <StatCard
                        title="Tweets"
                        value={stats.tweetCount}
                        icon={Twitter}
                        link="/admin/tweets"
                        linkText="View all Tweets →"
                        isLoading={isLoading}
                    />
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2 font-geist-sans">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-gist">
                                Recent Projects
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentProjectsList
                                projects={stats.recentProjects}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-gist">
                                Upcoming Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UpcomingEventsList
                                events={stats.upcomingEventsList}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
