'use client';

import { GitHubRepo } from "@/types/projects";
import { useEffect, useState } from "react";
import { fetchRepos } from "@/actions/projects";
import ReposPage from "@/components/RepositaryTable";

export default function ProjectsPage() {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepositories = async () => {
            const orgName = "dscnitrourkela";
            try {
                const data = await fetchRepos(orgName);
                setRepos(data);
            } catch (error) {
                console.error("Error fetching repositories:", error);
                setError(error instanceof Error ? error.message : 'Failed to load projects');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRepositories();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold text-center mb-8">Our Projects</h1>
                <div className="text-center">
                    <p className="text-lg">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold text-center mb-8">Our Projects</h1>
                <div className="text-center">
                    <p className="text-red-500 text-lg">Error: {error}</p>
                    <p className="mt-2">Please try refreshing the page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Our Projects</h1>

            <div className="mt-10">
                <ReposPage repos={repos} />
            </div>
        </div>
    );
}
