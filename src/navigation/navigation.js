import { access, readdir } from "node:fs/promises";

import os from "os";
import path from "node:path";
import { getCurrentPath } from "../helpers/getCurrentWorkingDirectory.js";

export const list = async (currentPath) => {
  try {
    const files = await readdir(`${currentPath}`);
    for (let file of files) {
      console.log(file);
      // process.stdout.write(`${file}${os.EOL}`);
    }
    // getCurrentPath(currentPath);
  } catch (err) {
    console.error(ex);
  }
};

export const goUp = async (currentPath, userHomeFolder) => {
  try {
    if (
      userHomeFolder.split(path.sep).length < currentPath.split(path.sep).length
    ) {
      await process.chdir(
        `${currentPath
          .split(path.sep)
          .splice(0, currentPath.split(path.sep).length - 1)
          .join(path.sep)}`
      );
      // getCurrentPath(currentPath);
    } else throw new Error("Invalid input");
  } catch (ex) {
    if (ex.message === "Invalid input") {
      console.error(ex.message);
    }
    else console.error(ex);
  }
};

export const goTo = async (currentPath, pathToGoData) => {
  try {
    if (pathToGoData.length === 2) {
      console.log(`${currentPath}${path.sep}${pathToGoData[1]}`.trim());
      await process.chdir(`${currentPath}${path.sep}${pathToGoData[1]}`.trim());
      // getCurrentPath(currentPath);
    } else throw new Error("Invalid input");
  } catch (ex) {
    if (ex.message === "Invalid input") {
      console.error(ex.message);
    }
    else if (ex.code === "ENOENT") {
      console.error("Operation failed, no such folder");
    }
    else console.error(ex);
  }
};
