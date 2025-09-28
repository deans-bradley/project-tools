import fs from 'fs-extra';

/**
 * Creates a new folder at the specified path.
 * If the folder already exists, does nothing.
 * @param {string} folderPath - The path where the folder should be created.
 */
export async function createFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdir(folderPath, { recursive: true });
  }
}