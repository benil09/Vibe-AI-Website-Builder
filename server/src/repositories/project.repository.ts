import { prisma } from "../lib/prisma";
import type { Project } from "@prisma/client";

export interface ProjectFilterOptions {
  userId?: string;
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
