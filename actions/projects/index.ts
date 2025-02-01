import { GitHubRepo } from "@/types/projects";

const GITHUB_API_URL = 'https://api.github.com';

export async function fetchRepos(orgName: string): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GitHub token is not set in environment variables.');
  }

  let repos: GitHubRepo[] = [];
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
    repos = repos.concat(data);

    
    const linkHeader = response.headers.get('Link');
    const nextLink = linkHeader?.split(',').find((link) => link.includes('rel="next"'));
    url = nextLink ? nextLink.split(';')[0].trim().slice(1, -1) : '';
  }

  return repos;
}