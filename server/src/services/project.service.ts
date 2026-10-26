import { findProjects, findProjectById } from "../repositories/project.repository";
import { LOCAL_USER_ID } from "../config/constants";

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
