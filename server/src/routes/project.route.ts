import { Router } from "express";
import {
  getProjects,
  getProject,
  createProjectHandler,
  getProjectMessagesHandler,
} from "../controllers/project.controller";
import { validate } from "../middlewares/validate";
import {
  getProjectParamsSchema,
  getProjectsQuerySchema,
  createProjectBodySchema,
} from "../validations/project.validation";

const router = Router();

// GET /api/projects - Fetch all projects
router.get("/", validate({ query: getProjectsQuerySchema }), getProjects);

// GET /api/projects/:id - Fetch project by ID
router.get("/:id", validate({ params: getProjectParamsSchema }), getProject);

// GET /api/projects/:id/messages - Fetch all messages for a project
router.get("/:id/messages", validate({ params: getProjectParamsSchema }), getProjectMessagesHandler);

// POST /api/projects - Create a new project with initial message
router.post("/", validate({ body: createProjectBodySchema }), createProjectHandler);

export default router;
