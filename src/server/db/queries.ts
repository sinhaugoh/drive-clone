import "server-only";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  files_table,
  folders_table,
  type DB_FileType,
} from "~/server/db/schema";
import { uploadFile } from "uploadthing/client-future";

export const QUERIES = {
  async getAllParents(folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .select()
        .from(folders_table)
        .where(eq(folders_table.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }

      parents.unshift(folder[0]);
      currentId = folder[0].parent;
    }

    return parents;
  },
  getFiles(folderId: number) {
    return db
      .select()
      .from(files_table)
      .where(eq(files_table.parent, folderId));
  },
  getFolders(folderId: number) {
    return db
      .select()
      .from(folders_table)
      .where(eq(folders_table.parent, folderId));
  },
};

export const MUTATIONS = {
  createFile(input: {
    file: {
      name: string;
      size: number;
      url: string;
    };
    userId: string;
  }) {
    return db.insert(files_table).values({ ...input.file, parent: 1 });
  },
};
