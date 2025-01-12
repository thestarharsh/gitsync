"use client";

import useGetProjects from "@/hooks/use-get-projects";
import { api } from "@/trpc/react";

const TeamMembers = () => {
  const { projectId } = useGetProjects();
  const { data: members } = api.project.getTeamMembers.useQuery({ projectId });

  return (
    <div className="flex items-center gap-2">
      {members?.map((member) => (
        <img
          key={member.id}
          src={member.user.imageUrl || ""}
          alt={member.user.firstName || ""}
          className="h-6 w-6 rounded-full"
        />
      ))}
    </div>
  );
};

export default TeamMembers;
