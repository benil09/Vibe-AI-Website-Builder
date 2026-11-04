import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";
import type { fileCollection } from "../lib/sandbox";

export type FileCollection = fileCollection;

export interface SaveResultInput {
  projectId: string;
  content?: string;
  title?: string;
  files?: FileCollection;
  sandboxUrl?: string;
  isError?: boolean;
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

