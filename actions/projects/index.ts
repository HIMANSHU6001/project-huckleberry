import { GitHubRepo, GitHubCommit } from '@/types/projects';

const GITHUB_API_URL = 'https://api.github.com';

export async function fetchLatestCommit(repoFullName: string): Promise<GitHubCommit | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GitHub token is not set in environment variables.');
  }

  const url = `${GITHUB_API_URL}/repos/${repoFullName}/commits?per_page=1`;

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    console.error(`Failed to fetch commits for ${repoFullName}: ${response.statusText}`);
    return null;
  }

  const data = await response.json();
  if (data.length === 0) {
    return null;
  }

  return data[0];
}

export async function fetchRepos(orgName: string): Promise<GitHubRepo[]> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token is not set in environment variables.');
    }
  
    const repos: GitHubRepo[] = [];
    let url = `${GITHUB_API_URL}/orgs/${orgName}/repos?per_page=100`;
  
    while (url) {
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
        const latestCommit = await fetchLatestCommit(repo.full_name);
        repos.push({ ...repo, latestCommit });
      }
  
      // Handle pagination
      const linkHeader = response.headers.get('Link');
      const nextLink = linkHeader?.split(',').find((link) => link.includes('rel="next"'));
      url = nextLink ? nextLink.split(';')[0].trim().slice(1, -1) : '';
    }
  
    return repos;
  }