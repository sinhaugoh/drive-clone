import { getAllParents, getFiles, getFolders } from "~/server/db/queries";
import DriveContents from "../../drive-contents";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid Folder Id</div>;
  }

  const [folders, files, parents] = await Promise.all([
    getFolders(parsedFolderId),
    getFiles(parsedFolderId),
    getAllParents(parsedFolderId),
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
