import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";
import type { fileCollection } from "../lib/sandbox";
import { formatPlanForAgent, parsePlanMessage } from "../lib/plan";

export type FileCollection = fileCollection;

export interface SaveResultInput {
  projectId: string;
  content?: string;
  title?: string;
  files?: FileCollection;
  sandboxUrl?: string;
  isError?: boolean;
}


export function formatLoadedDbContent(content:any|null | undefined):string{
  const todo = parsePlanMessage(content);
  return todo ? formatPlanForAgent(todo) : String(content ?? "");
  
}

// -> creates assistant message in db (with fragment if result, without fragment if isError) and returns it with fragment included
export async function saveResult(input: SaveResultInput): Promise<any>;
export async function saveResult(
  projectId: string,
  content?: string,
  title?: string,
  files?: FileCollection,
  sandboxUrl?: string,
  isError?: boolean
): Promise<any>;
export async function saveResult(
  firstArg: string | SaveResultInput,
  contentArg?: string,
  _titleArg?: string,
  filesArg?: FileCollection,
  sandboxUrlArg?: string,
  isErrorArg?: boolean
) {
  const isObject = typeof firstArg === "object" && firstArg !== null;
  const projectId = isObject ? firstArg.projectId : firstArg;
  const content = isObject ? firstArg.content : contentArg;
  const files = isObject ? firstArg.files : filesArg;
  const sandboxUrl = isObject ? firstArg.sandboxUrl : sandboxUrlArg;
  const isError = isObject ? firstArg.isError : isErrorArg;

  if (isError) {
    return prisma.message.create({
      data: {
        projectId,
        content,
        role: "assistant",
        type: "error",
      },
      include: {
        fragment: true,
      },
    });
  }

  return prisma.message.create({
    data: {
      projectId,
      content,
      role: "assistant",
      type: "result",
      fragment: {
        create: {
          sandboxUrl: sandboxUrl || "",
          files: (files || {}) as Prisma.InputJsonValue,
        },
      },
    },
    include: {
      fragment: true,
    },
  });
}

// -> retrieves up to 5 messages for a projectId in descending order of creation
export async function getRecentMessagesByProjectId(projectId: string) {
  const messages = await prisma.message.findMany({
    where: { projectId },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });


  return messages.reverse().map((message) => ({
    role: message.role,
    content: formatLoadedDbContent(message.content),
  }));
}

export const loadProjectMessages = getRecentMessagesByProjectId;


