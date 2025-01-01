"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import useRefetch from "@/hooks/use-refetch";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  function onSubmit(data: FormInput) {
    createProject.mutate({
      name: data.projectName,
      githubUrl: data.repoUrl,
      githubToken: data.githubToken,
    }, {
      onSuccess: () => {
        toast.success("Project created successfully");
        refetch();
        reset();
      },
      onError: () => {
        toast.error("Failed to create project");
      },
    }
    );
    return true;
  }

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img src="/github_person.svg" className="h-56 w-auto" />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link Your GitHub Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter URL of your repository to link it to GitSync
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("repoUrl", { required: true })}
              type="url"
              placeholder="GitHub Repository URL"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("githubToken")}
              placeholder="GitHub Token (Optional)"
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={createProject.isPending}>
                Create
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
