// src/services/ai-version.service.ts
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type ContentVersionCreateInput = {
  contentId: string;
  contentType: string;
  data: Prisma.InputJsonValue;
  createdBy: string;
  generationId?: string;
  changeType: string;
  changes?: Prisma.InputJsonValue;
};

export const aiVersionService = {
  // Create a new version
  async create(data: ContentVersionCreateInput) {
    // Get the latest version number
    const latest = await db.aIContentVersion.findFirst({
      where: {
        contentId: data.contentId,
        contentType: data.contentType,
      },
      orderBy: { version: "desc" },
    });

    const newVersion = (latest?.version || 0) + 1;

    // Set all existing versions as not current
    await db.aIContentVersion.updateMany({
      where: {
        contentId: data.contentId,
        contentType: data.contentType,
        isCurrent: true,
      },
      data: { isCurrent: false },
    });

    // Create the new version
    return db.aIContentVersion.create({
      data: {
        contentId: data.contentId,
        contentType: data.contentType,
        version: newVersion,
        data: data.data,
        changes: data.changes,
        createdBy: data.createdBy,
        generationId: data.generationId,
        changeType: data.changeType,
        isCurrent: true,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        generation: true,
      },
    });
  },

  // Get the current version of content
  async getCurrent(contentId: string, contentType: string) {
    return db.aIContentVersion.findFirst({
      where: {
        contentId,
        contentType,
        isCurrent: true,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        generation: true,
      },
    });
  },

  // Get a specific version
  async getVersion(contentId: string, contentType: string, version: number) {
    return db.aIContentVersion.findUnique({
      where: {
        contentId_contentType_version: {
          contentId,
          contentType,
          version,
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        generation: true,
      },
    });
  },

  // Get all versions of content
  async getAllVersions(contentId: string, contentType: string) {
    return db.aIContentVersion.findMany({
      where: {
        contentId,
        contentType,
      },
      orderBy: { version: "desc" },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        generation: true,
      },
    });
  },

  // Rollback to a specific version
  async rollback(
    contentId: string,
    contentType: string,
    version: number,
    userId: string,
  ) {
    // Get the target version
    const targetVersion = await db.aIContentVersion.findUnique({
      where: {
        contentId_contentType_version: {
          contentId,
          contentType,
          version,
        },
      },
    });

    if (!targetVersion) {
      throw new Error("Version not found");
    }

    // Create a new version with the old data
    return this.create({
      contentId,
      contentType,
      data: targetVersion.data as Prisma.InputJsonValue,
      createdBy: userId,
      changeType: "ROLLBACK",
      changes: { rolledBackTo: version },
    });
  },

  // Get version history count
  async getVersionCount(contentId: string, contentType: string) {
    return db.aIContentVersion.count({
      where: {
        contentId,
        contentType,
      },
    });
  },
};
