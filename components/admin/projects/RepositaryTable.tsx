'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TableRepo } from '@/types/projects';
import { publishRepos, unpublishRepos } from '@/actions/projects';
import { withLoadingToast } from '@/utils';
import { ApiResponse } from '@/types/commons';

interface ReposPageProps {
  repos: TableRepo[];
  publishedRepos: string[];
}

export default function ReposPage({
  repos: initialRepos,
  publishedRepos,
}: ReposPageProps) {
  const [repos, setRepos] = useState<TableRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRepos(initialRepos);
  }, [initialRepos]);

  const toggleSelection = (id: string) => {
    setRepos((prevRepos) =>
      prevRepos.map((repo) =>
        repo.id === id ? { ...repo, isSelected: !repo.isSelected } : repo
      )
    );
  };

  const handlePublish = withLoadingToast(async (): Promise<ApiResponse> => {
    setIsLoading(true);
    const selectedRepos = repos
      .filter((repo) => repo.isSelected)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
      }));

    if (selectedRepos.length === 0) {
      return {
        status: 'error',
        message: 'No repositories selected',
        statusCode: 400,
      };
    }

    const reposToUnpublish = publishedRepos.filter(
      (repo_id) => !selectedRepos.some((repo) => repo.id === repo_id)
    );

    await unpublishRepos(reposToUnpublish);
    const result = await publishRepos(selectedRepos);
    setIsLoading(false);

    return result;
  });

  return (
    <div className="container mx-auto p-6 font-geist-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Repositories</h1>
        <Button onClick={handlePublish} variant="default" disabled={isLoading}>
          Publish Selected
        </Button>
      </div>
      <table className="min-w-full border border-gray-700">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4 text-left">Repository Name</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-center">Published</th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repo) => (
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
