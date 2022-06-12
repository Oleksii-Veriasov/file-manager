import {
  access,
  readFile,
  writeFile,
  appendFile,
  open,
  rm,
} from "node:fs/promises";
import { constants } from "fs";
// import { open } from "fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";
// import os from "os";
// import { getCurrentPath } from "../helpers/getCurrentWorkingDirectory.js";

export const read = async (currentPath, pathToFileData) => {
  try {
    // if (pathToFileData.length === 2) {
    console.log(`${currentPath}${path.sep}${pathToFileData}`.trim());
    await access(
      `${currentPath}${path.sep}${pathToFileData}`.trim(),
      constants.R_OK
    );
    // console.log(`${currentPath}${path.sep}${pathToFileData[1]}`.trim())
    const fd = await open(`${currentPath}${path.sep}${pathToFileData}`.trim());
    let output = process.stdout;
    pipeline(fd.createReadStream({ encoding: "utf8" }), await output);
    // getCurrentPath(currentPath);
    // } else throw new Error("Invalid input");
  } catch (ex) {
    if (ex.message === "Invalid input") {
      console.error(ex.message);
    } else if (ex.code === "ENOENT") {
      console.error("Operation failed, no such file");
    } else console.error(ex);
  }
};

export const create = async (currentPath, newFileData) => {
  try {
    console.log("create", `${currentPath}${path.sep}${newFileData}`.trim());
    await writeFile(`${currentPath}${path.sep}${newFileData}`.trim(), "");
  } catch (ex) {
    console.error(ex);
  }
};

export const rename = async (currentPath, oldFileData, newFileData) => {
  try {
    console.log(`${currentPath}${path.sep}${oldFileData}`.trim());
    console.log(`${currentPath}${path.sep}${newFileData}`.trim());

    await access(`${currentPath}${path.sep}${oldFileData}`.trim());
    let newFile = `${currentPath}${path.sep}${newFileData}`.trim();
    const fileRead = await open(`${currentPath}${path.sep}${oldFileData}`);
    const fileWrite = await open(newFile, "r+");
    create(currentPath, newFileData);
    pipeline(
      fileRead.createReadStream({ encoding: "utf8" }),
      fileWrite.createWriteStream()
    );
  } catch (ex) {
    if (ex.code === "ENOENT") {
      console.error("Operation failed, no such file to read");
    } else console.error(ex);
  }
};

export const moveFile = async (currentPath, oldFileData, newPath) => {
  try {
    console.log("oldFile", `${currentPath}${path.sep}${oldFileData}`.trim());
    let fileName = path.basename(
      `${currentPath}${path.sep}${oldFileData}`.trim()
    );
    console.log(
      `${currentPath}${path.sep}${newPath.trim()}${path.sep}${fileName}`
    );

    await access(`${currentPath}${path.sep}${oldFileData}`.trim());
    await access(`${currentPath}${path.sep}${newPath}`.trim());
    let newFile = `${currentPath}${path.sep}${newPath.trim()}${
      path.sep
    }${fileName}`;
    console.log("newFile: ", newFile);
    const fileRead = await open(`${currentPath}${path.sep}${oldFileData}`);
    // console.log(fileRead);

    console.log("create before");
    create(currentPath, `${newPath.trim()}${path.sep}${fileName}`);
    console.log("create+");
    const fileWrite = await open(newFile, "r+");
    pipeline(
      fileRead.createReadStream({ encoding: "utf8" }),
      fileWrite.createWriteStream()
    );
    deleteFile(currentPath, `${fileName.trim()}`);
  } catch (ex) {
    if (ex.code === "ENOENT") {
      console.error("Operation failed, no such file or directory");
    } else console.error(ex);
  }
};

export const deleteFile = async (currentPath, deleteFileData) => {
  try {
    console.log(`${currentPath}${path.sep}${deleteFileData}`.trim());
    await rm(`${currentPath}${path.sep}${deleteFileData}`.trim());
  } catch (ex) {
    console.error(ex);
  }
};
