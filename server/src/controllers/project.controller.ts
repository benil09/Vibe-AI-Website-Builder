import { Request, Response } from "express";
import { getAllProjects, getProjectById } from "../services/project.service";

/**
 * Controller to fetch all projects.
 * Supports optional ?userId query param, otherwise falls back to LOCAL_USER_ID.
 */
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
    const projects = await getAllProjects(userId);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching projects",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Controller to fetch a single project by ID (/api/projects/:id).
 */
export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Project ID is required in route params",
      });
      return;
    }

    const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
    const project = await getProjectById(id, userId);

    if (!project) {
      res.status(404).json({
        success: false,
        message: `Project with ID '${id}' was not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(`Error fetching project ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching project",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
