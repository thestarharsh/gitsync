"use client";

import Link from "next/link";

import useGetProjects from "@/hooks/use-get-projects";
import { api } from "@/trpc/react";

import { Badge } from "@/components/ui/badge";

import MeetingCard from "../dashboard/meeting-card";
import { Button } from "@/components/ui/button";

const MeetingsPage = () => {
  const { projectId } = useGetProjects();
  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    { projectId },
    {
      refetchInterval: 5000,
    },
  );

  return (
    <>
      <MeetingCard />
      <div className="h-6"></div>
      <h1 className="text-xl font-semibold">Meetings</h1>
      {meetings && meetings.length === 0 && <div>No Meetings Found</div>}
      {isLoading && <div>Loading...</div>}
      <ul className="divide-y divide-gray-200">
        {meetings?.map((meeting) => (
          <li
            key={meeting.id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/meetings/${meeting.id}`}
                    className="text-sm font-semibold"
                  >
                    {meeting.name}
                  </Link>
                  {meeting.status === "PROCESSING" && (
                    <Badge className="bg-yellow-500 text-white">
                      Processing...
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-2 text-xs text-gray-500">
                <p className="whitespace-nowrap">
                  {meeting?.createdAt.toLocaleDateString()}
                </p>
                <p className="truncate">{meeting?.issues?.length} issues</p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <Button variant={"outline"} asChild>
                <Link href={`/meetings/${meeting.id}`}>View Meeting</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MeetingsPage;
