import { z } from "zod";

import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createProjectSchema = z.object({
    name: z.string().min(1),
    githubUrl: z.string(),
    githubToken: z.string().optional(),
})

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure
        .input(createProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const project = await ctx.db.project.create({
                data: {
                    name: input.name,
                    githubUrl: input.githubUrl,
                    userToProjects: {
                        create: {
                            userId: ctx.user.userId!,
                        }
                    }
                }
            })

            await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
            await pollCommits(project.id);
            return project;
        }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.project.findMany({
            where: {
                userToProjects: {
                    some: {
                        userId: ctx.user.userId!,
                    },
                },
                deletedAt: null,
            },
        })
    }),
    getCommits: protectedProcedure.input(z.object({
        projectId: z.string(),
    })).query(async ({ ctx, input }) => {
        pollCommits(input.projectId).then().catch(console.error);
        return await ctx.db.commit.findMany({ where: { projectId: input.projectId } });
    }),
    saveAnswer: protectedProcedure.input(z.object({
        projectId: z.string(),
        fileReferences: z.any(),
        question: z.string(),
        answer: z.string(),
    })).mutation(async ({ ctx, input}) => {
        return await ctx.db.question.create({
            data: {
                answer: input.answer,
                fileReferences: input.fileReferences,
                projectId: input.projectId,
                question: input.question,
                userId: ctx.user.userId!,
            }
        })
    }),
    getQuestions: protectedProcedure.input(z.object({ 
        projectId: z.string() 
    })).query(async ({ ctx, input}) => {
        return await ctx.db.question.findMany({
            where: {
                projectId: input.projectId,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
    })
});