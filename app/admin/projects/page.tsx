import { GitHubRepo } from "@/types/projects";
import { fetchRepos } from "@/actions/projects";
import { ProjectCard } from "@/components/ProjectCard";

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

export default async function ProjectsPage() {
    const orgName = "dscnitrourkela";
    let repos: GitHubRepo[] = [];

    try {
        repos = await fetchRepos(orgName);
    } catch (error) {
        console.error("Error fetching repositories:", error);
    }

    // Filter repositories based on their IDs
    const filteredRepos = repos.filter((repo) =>
        REPO_IDS_TO_RENDER.includes(repo.id)
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Our Projects</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRepos.map((repo) => (
                    <ProjectCard key={repo.id} repo={repo} />
                ))}
            </div>
        </div>
    );
}