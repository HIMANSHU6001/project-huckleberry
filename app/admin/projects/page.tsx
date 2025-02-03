'use client';

import { GitHubRepo } from "@/types/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { useEffect, useState } from "react";
import { fetchRepos } from "@/actions/projects";

const REPO_IDS_TO_RENDER = [
    915663472, //waffle
    803870541, //vanilla
    755467056, //udon
    729890134, //ticket
    602117160, //tart
    552333690, //raisin
    321042979, //huckleberry
    236785498, //dates
];

export default function ProjectsPage() {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepositories = async () => {
            const orgName = "dscnitrourkela";
            try {
                const data = await fetchRepos(orgName);
                const filteredRepos = data.filter((repo: GitHubRepo) =>
                    REPO_IDS_TO_RENDER.includes(repo.id)
                );
                setRepos(filteredRepos);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo) => (
                    <ProjectCard key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    );
}