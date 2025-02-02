import { GitHubRepo } from "@/types/projects";
import { fetchRepos } from "@/actions/projects";
import { ProjectCard } from "@/components/ProjectCard";

export default async function ProjectsPage() {
    const orgName = "dscnitrourkela";
    let repos: GitHubRepo[] = [];

    try {
        repos = await fetchRepos(orgName);
    } catch (error) {
        console.error("Error fetching repositories:", error);
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">
                Our Projects
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo) => (
                    <ProjectCard key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    );
}
