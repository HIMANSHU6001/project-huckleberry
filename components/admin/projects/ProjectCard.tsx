'use client';

import React, { useState } from 'react';
import { Clock, Code, GitFork, Users, ExternalLink } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitHubRepo } from '@/types/projects';

export const ProjectCard = ({ repo }: { repo: GitHubRepo }) => {
  const [showAllContributors, setShowAllContributors] = useState(false);
  const initialContributorsCount = 6;

  const displayedContributors = showAllContributors
    ? repo.contributors
    : repo.contributors.slice(0, initialContributorsCount);

  return (
    <Card className="w-full bg-card hover:shadow-lg transition-all duration-300 border-muted">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{repo.name}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => window.open(repo.html_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on GitHub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">
          {repo.description || 'No description available.'}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-xs">
                  {new Date(repo.created_at).toLocaleDateString()}
                </span>
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                <Code className="h-3 w-3 mr-1" />
                <span className="text-xs">
                  {new Date(repo.pushed_at).toLocaleDateString()}
                </span>
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1">
                <GitFork className="h-3 w-3 mr-1" />
                <span className="text-xs">{repo.forks} forks</span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contributors
            </h3>
          </div>

          {repo.contributors.length > 0 ? (
            <ScrollArea className="h-full w-full rounded-md">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-1">
                {displayedContributors.map((contributor) => (
                  <TooltipProvider key={contributor.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={contributor.avatar_url}
                              alt={contributor.login}
                            />
                            <AvatarFallback>
                              {contributor.login.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {contributor.login}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {contributor.contributions} commits
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{contributor.login}</p>
                        <p className="text-xs text-muted-foreground">
                          {contributor.contributions} contributions
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">
              No contributors found.
            </p>
          )}
        </div>
      </CardContent>

      {repo.contributors.length > initialContributorsCount && (
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowAllContributors(!showAllContributors)}
          >
            {showAllContributors
              ? 'Show Less'
              : `Show All (${repo.contributors.length})`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
