import { Router } from "express";
import { getProjects, getProject } from "../controllers/project.controller";

const router = Router();

// GET /api/projects - Fetch all projects
router.get("/", getProjects);

// GET /api/projects/:id - Fetch project by ID
router.get("/:id", getProject);

export default router;
