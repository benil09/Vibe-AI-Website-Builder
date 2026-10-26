import { Router } from "express";

import projectRouter from "./project.route";

const router = Router();

// Project routes
router.use("/projects", projectRouter);

export default router;
