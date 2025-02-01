import { GitHubRepo } from '@/types/projects';
import { fetchRepos } from '@/actions/projects';
import { Calendar, GitFork, Clock, GitCommit, ExternalLink } from 'lucide-react';

export default async function ProjectsPage() {
  const orgName = 'dscnitrourkela';
  let repos: GitHubRepo[] = [];

  try {
    repos = await fetchRepos(orgName);
    repos.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
  } catch (error) {
    console.error('Error fetching repositories:', error);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Our Projects
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                  {repo.name}
                </h2>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>

              <p className="text-gray-600 mb-6 line-clamp-2 min-h-[48px]">
                {repo.description || 'No description available.'}
              </p>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Created: {new Date(repo.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <GitFork className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Forks: {repo.forks}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Updated: {new Date(repo.pushed_at).toLocaleDateString()}</span>
                </div>
              </div>

              {repo.latestCommit && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-start space-x-2">
                    <GitCommit className="h-4 w-4 mt-1 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 line-clamp-2 font-medium">
                        {repo.latestCommit.commit.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          By {repo.latestCommit.commit.author.name}
                          <span className="mx-2">•</span>
                          {new Date(repo.latestCommit.commit.author.date).toLocaleDateString()}
                        </p>
                        <a
                          href={repo.latestCommit.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}