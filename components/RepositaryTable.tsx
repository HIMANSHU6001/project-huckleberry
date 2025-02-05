'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GitHubRepo } from "@/types/projects";

// Define a table-friendly repo type
interface TableRepo {
    id: string;
    name: string;
    description: string;
    isSelected: boolean;
}

// Define props for the page
interface ReposPageProps {
    repos: GitHubRepo[];
}

export default function ReposPage({ repos: initialRepos }: ReposPageProps) {
    const [repos, setRepos] = useState<TableRepo[]>([]);

    useEffect(() => {
        setRepos(
            initialRepos.map(repo => ({
                id: String(repo.id),
                name: repo.name,
                description: repo.description || "No description available",
                isSelected: false,
            }))
        );
    }, [initialRepos]);

    // Function to toggle selection
    const toggleSelection = (id: string) => {
        setRepos(prevRepos =>
            prevRepos.map(repo =>
                repo.id === id ? { ...repo, isSelected: !repo.isSelected } : repo
            )
        );
    };

    const handlePublish = () => {
        const selectedRepoIds = repos
            .filter(repo => repo.isSelected)
            .map(repo => repo.id);

        console.log("Selected Repo IDs:", selectedRepoIds);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Repositories</h1>
                <Button onClick={handlePublish} variant="default">
                    Publish Selected
                </Button>
            </div>
            <table className="min-w-full border border-gray-700">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="p-4 text-left">Repository Name</th>
                        <th className="p-4 text-left">Description</th>
                        <th className="p-4 text-center">Select</th>
                    </tr>
                </thead>
                <tbody>
                    {repos.map(repo => (
                        <tr key={repo.id} className="border-b border-gray-700">
                            <td className="p-4">{repo.name}</td>
                            <td className="p-4">{repo.description}</td>
                            <td className="p-4 text-center">
                                <Checkbox 
                                    checked={repo.isSelected} 
                                    onCheckedChange={() => toggleSelection(repo.id)} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
