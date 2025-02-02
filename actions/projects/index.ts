import { GitHubRepo, GitHubContributor } from '@/types/projects';

const GITHUB_API_URL = 'https://api.github.com';

export async function fetchContributors(repoFullName: string): Promise<GitHubContributor[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GitHub token is not set in environment variables.');
  }

  let contributors: GitHubContributor[] = [];
  let url = `${GITHUB_API_URL}/repos/${repoFullName}/contributors?per_page=100`;

  while (url) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch contributors for ${repoFullName}: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      contributors = contributors.concat(data);

      // Handle pagination
      const linkHeader = response.headers.get('Link');
      const nextLink = linkHeader?.split(',').find((link) => link.includes('rel="next"'));
      url = nextLink ? nextLink.split(';')[0].trim().slice(1, -1) : '';
    } catch (error) {
      console.error(`Error fetching contributors for ${repoFullName}:`, error);
      return [];
    }
  }

  return contributors;
}

export async function fetchRepos(orgName: string): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GitHub token is not set in environment variables.');
  }

  const repos: GitHubRepo[] = [];
  
  let url = `${GITHUB_API_URL}/orgs/${orgName}/repos?per_page=100&sort=created&direction=desc`;

  while (url) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
      }

      const data: GitHubRepo[] = await response.json();
      for (const repo of data) {
        try {
          const contributors = await fetchContributors(repo.full_name);
          repos.push({ ...repo, contributors }); 
        } catch (error) {
          console.error(`Error fetching contributors for ${repo.full_name}:`, error);
          repos.push({ ...repo, contributors: [] }); 
        }
      }

      // Handle pagination
      const linkHeader = response.headers.get('Link');
      const nextLink = linkHeader?.split(',').find((link) => link.includes('rel="next"'));
      url = nextLink ? nextLink.split(';')[0].trim().slice(1, -1) : '';
    } catch (error) {
      console.error('Error fetching repositories:', error);
      break; 
    }
  }

  // Add an additional sort to ensure newest repos are first, in case the API response isn't perfectly sorted
  return repos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}