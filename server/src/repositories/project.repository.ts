import { prisma } from "../lib/prisma";
import type { Project } from "@prisma/client";

export interface ProjectFilterOptions {
  userId?: string;
}

export interface CreateProjectRepoInput {
  name: string;
  userId: string;
  messageContent: string;
}

/**
 * Fetch all projects, optionally filtered by userId, ordered by last updated.
 */
export const findProjects = async (filter?: ProjectFilterOptions): Promise<Project[]> => {
  return prisma.project.findMany({
    where: filter?.userId ? { userId: filter.userId } : undefined,
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
};

/**
 * Fetch a single project by ID (optionally scoped to userId), including associated messages and fragments.
 */
export const findProjectById = async (id: string, userId?: string) => {
  return prisma.project.findFirst({
    where: {
      id,
      ...(userId ? { userId } : {}),
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          fragment: true,
        },
      },
    },
  });
};

/**
 * Create a new project with an initial user message atomically.
 */
export const createProject = async (data: CreateProjectRepoInput) => {
  return prisma.project.create({
    data: {
      name: data.name,
      userId: data.userId,
      messages: {
        create: {
          role: "user",
          type: "result",
          content: data.messageContent,
        },
      },
    },
    include: {
      messages: {
        include: {
          fragment: true,
        },
      },
    },
  });
};

/**
 * Fetch all messages for a specific project ID, ordered chronologically.
 */
export const findMessagesByProjectId = async (projectId: string) => {
  return prisma.message.findMany({
    where: { projectId },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      fragment: true,
    },
  });
};
