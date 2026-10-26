import { z } from "zod";

/**
 * Validation schema for GET /api/projects/:id params
 */
export const getProjectParamsSchema = z.object({
  id: z.string().trim().min(1, "Project ID cannot be empty"),
});

/**
 * Validation schema for GET /api/projects query parameters
 */
export const getProjectsQuerySchema = z.object({
  userId: z.string().trim().optional(),
});

/**
 * Validation schema for creating a new project with initial message
 */
export const createProjectBodySchema = z
  .object({
    content: z.string().trim().min(1, "Message content cannot be empty").optional(),
    message: z.string().trim().min(1, "Message content cannot be empty").optional(),
    name: z.string().trim().optional(),
  })
  .refine((data) => Boolean(data.content || data.message), {
    message: "Message content is required",
    path: ["content"],
  });

export type GetProjectParams = z.infer<typeof getProjectParamsSchema>;
export type GetProjectsQuery = z.infer<typeof getProjectsQuerySchema>;
export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
