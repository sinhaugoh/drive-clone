import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

export async function getAllParents(folderId: number) {
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
}

export function getFiles(folderId: number) {
  return db.select().from(files_table).where(eq(files_table.parent, folderId));
}

export function getFolders(folderId: number) {
  return db
    .select()
    .from(folders_table)
    .where(eq(folders_table.parent, folderId));
}
