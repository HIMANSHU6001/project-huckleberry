import { GitHubRepo, GitHubContributor } from '@/types/projects';

const GITHUB_API_URL = 'https://api.github.com';
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

async function fetchPaginatedData<T>(url: string, token: string): Promise<T[]> {
  const results: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    try {
      const response = await fetch(nextUrl, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data: T[] = await response.json();
      results.push(...data);

      // Handle pagination
      const linkHeader = response.headers.get('Link');
      const nextLink = linkHeader?.split(',').find((link) => link.includes('rel="next"'));
      nextUrl = nextLink ? nextLink.split(';')[0].trim().slice(1, -1) : null;
    } catch (error) {
      console.error('Error fetching paginated data:', error);
      throw error;
    }
  }

  return results;
}

export async function fetchContributors(repoFullName: string): Promise<GitHubContributor[]> {

  if (!token) {
    throw new Error('GitHub token is not set in environment variables.');
  }

  const url = `${GITHUB_API_URL}/repos/${repoFullName}/contributors?per_page=100`;
  return fetchPaginatedData<GitHubContributor>(url, token);
}

export async function fetchRepos(orgName: string): Promise<GitHubRepo[]> {
  if (!token) {
    throw new Error('GitHub token is not set in environment variables.');
  }

  const url = `${GITHUB_API_URL}/orgs/${orgName}/repos?per_page=100&sort=created&direction=desc`;
  const repos = await fetchPaginatedData<GitHubRepo>(url, token);

  // Fetch contributors for all repositories in parallel
  const reposWithContributors = await Promise.all(
    repos.map(async (repo) => {
      try {
        const contributors = await fetchContributors(repo.full_name);
        return { ...repo, contributors };
      } catch (error) {
        console.error(`Error fetching contributors for ${repo.full_name}:`, error);
        return { ...repo, contributors: [] };
      }
    })
  );

  // Ensure the repos are sorted by creation date
  return reposWithContributors.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}