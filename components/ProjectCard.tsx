"use client";

import React, { useState } from 'react';
import { Clock, Code, GitFork, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitHubRepo } from '@/types/projects';

export const ProjectCard = ({ repo }: { repo: GitHubRepo }) => {
  const [showAllContributors, setShowAllContributors] = useState(false);
  const initialContributorsCount = 6; // Increased to show 2 rows in grid
  
  const displayedContributors = showAllContributors 
    ? repo.contributors 
    : repo.contributors.slice(0, initialContributorsCount);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-semibold text-slate-700 hover:text-blue-500 transition-colors duration-300"
          >
            {repo.name}
          </a>
        </CardTitle>
        <p className="text-slate-500 text-sm mt-2">
          {repo.description || 'No description available.'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Created: {new Date(repo.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="h-4 w-4 text-slate-400" />
              <span>Forks: {repo.forks}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Code className="h-4 w-4 text-slate-400" />
              <span>Last updated: {new Date(repo.pushed_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-600">Contributors</h3>
              </div>
            </div>
            
            {repo.contributors.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {displayedContributors.map((contributor) => (
                    <div 
                      key={contributor.id} 
                      className="flex items-center p-2 rounded-lg hover:bg-slate-50"
                    >
                      <img
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-slate-600 truncate block">
                          {contributor.login}
                        </span>
                        <p className="text-xs text-slate-400">
                          {contributor.contributions}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {repo.contributors.length > initialContributorsCount && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-slate-500 hover:text-slate-700 border-slate-200 hover:border-slate-300"
                    onClick={() => setShowAllContributors(!showAllContributors)}
                  >
                    {showAllContributors ? 'Show Less' : `Show All (${repo.contributors.length})`}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No contributors found.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};