import { generateSlug } from "random-word-slugs";
import {
  findProjects,
  findProjectById,
  createProject,
  findMessagesByProjectId,
} from "../repositories/project.repository";
import { LOCAL_USER_ID } from "../config/constants";
import { fileCollection } from "../lib/sandbox";
import { startCodeAgentWorkflow } from "../temporal/client";

export const HELLO_WORLD_FILES: fileCollection = {
  "src/App.tsx": `export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}`,
};

export interface CreateProjectInput {
  content: string;
  name?: string;
  userId?: string;
}

export const getAllProjects = async (userId?: string) => {
  const targetUserId = userId || LOCAL_USER_ID;
  return findProjects({ userId: targetUserId });
};

export const getProjectById = async (id: string, userId?: string) => {
  return findProjectById(id, userId);
};

export const createNewProject = async (input: CreateProjectInput) => {
  const projectName = input.name || generateSlug(3, { format: "kebab" });
  const userId = input.userId || LOCAL_USER_ID;

  const project = await createProject({
    name: projectName,
    userId,
    messageContent: input.content,
  });

  await startCodeAgentWorkflow({
    projectId: project.id,
    prompt: input.content
  });

  return project;
};

export const getProjectMessages = async (projectId: string, userId?: string) => {
  const project = await findProjectById(projectId, userId);
  if (!project) {
    return null;
  }

  return findMessagesByProjectId(projectId);
};
