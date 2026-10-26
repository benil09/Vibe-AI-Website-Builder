import { generateSlug } from "random-word-slugs";
import {
  findProjects,
  findProjectById,
  createProject,
  findMessagesByProjectId,
} from "../repositories/project.repository";
import { LOCAL_USER_ID } from "../config/constants";

export interface CreateProjectInput {
  content: string;
  name?: string;
  userId?: string;
}

/**
 * Fetch all projects for a user.
 * Defaults to LOCAL_USER_ID if no userId is explicitly provided.
 */
export const getAllProjects = async (userId?: string) => {
  const targetUserId = userId || LOCAL_USER_ID;
  return findProjects({ userId: targetUserId });
};

/**
 * Fetch a single project by its ID, optionally scoped by user.
 */
export const getProjectById = async (id: string, userId?: string) => {
  return findProjectById(id, userId);
};

/**
 * Create a new project with a generated random slug and initial message.
 */
export const createNewProject = async (input: CreateProjectInput) => {
  const projectName = input.name || generateSlug(3, { format: "kebab" });
  const userId = input.userId || LOCAL_USER_ID;

  return createProject({
    name: projectName,
    userId,
    messageContent: input.content,
  });
};

/**
 * Fetch all messages for a project after verifying project existence.
 */
export const getProjectMessages = async (projectId: string, userId?: string) => {
  const project = await findProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  return findMessagesByProjectId(projectId);
};
