"use client";

import { ExternalLink, Github } from "lucide-react";

import useGetProjects from "@/hooks/use-get-projects";
import Link from "next/link";

const DashboardPage = () => {
  const { project } = useGetProjects();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="w-fit rounded-md bg-primary px-4 py-3">
          <div className="flex items-center">
            <Github className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                This project is linked to {` `}
                <Link
                  href={project?.githubUrl ?? ""}
                  className="inline-flex items-center text-white/80 hover:underline"
                  target="_blank"
                >
                  {project?.githubUrl ?? "No repository linked"}
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="h-4"></div>
          <div className="flex items-center gap-4">
            Team members
            Invite link
            Archive
          </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            Ask Question
            Meeting
        </div>
      </div>
      <div className="mt-8"></div>
      commit log
    </div>
  );
};

export default DashboardPage;