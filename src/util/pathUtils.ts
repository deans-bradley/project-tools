import fs from 'fs-extra';

/**
 * Creates a new folder at the specified path.
 * If the folder already exists, does nothing.
 */
export async function createFolder(folderPath: string) : Promise<void> {
  if (!fs.existsSync(folderPath)) {
    fs.mkdir(folderPath, { recursive: true });
  }
}