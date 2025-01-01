import { z } from "zod";

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
});