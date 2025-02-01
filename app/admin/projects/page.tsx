import { GitHubRepo } from "@/types/projects";
import { fetchRepos } from "@/actions/projects";

export default async function ProjectsPage() {
  const orgName = 'dscnitrourkela';
  let repos: GitHubRepo[] = [];

  try {
    repos = await fetchRepos(orgName);
  } catch (error) {
    console.error('Error fetching repositories:', error);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                {repo.name}
              </h2>
              <p className="mt-2 text-gray-600">{repo.description || 'No description available.'}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>Last updated: {new Date(repo.pushed_at).toLocaleDateString()}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}