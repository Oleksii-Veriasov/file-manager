import { access, writeFile, open, rm } from "node:fs/promises";
import { constants } from "fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";

export const read = async (currentPath, pathToFileData) => {
  try {
    await access(
      `${currentPath}${path.sep}${pathToFileData}`.trim(),
      constants.R_OK
    );
    const fd = await open(`${currentPath}${path.sep}${pathToFileData}`.trim());
    let output = process.stdout;
    pipeline(fd.createReadStream({ encoding: "utf8" }), await output);
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
    await writeFile(`${currentPath}${path.sep}${newFileData}`.trim(), "");
  } catch (ex) {
    console.error(ex);
  }
};

export const rename = async (currentPath, oldFileData, newFileData) => {
  try {
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
    let fileName = path.basename(
      `${currentPath}${path.sep}${oldFileData}`.trim()
    );

    await access(`${currentPath}${path.sep}${oldFileData}`.trim());
    await access(`${currentPath}${path.sep}${newPath}`.trim());
    let newFile = `${currentPath}${path.sep}${newPath.trim()}${
      path.sep
    }${fileName}`;

    const fileRead = await open(`${currentPath}${path.sep}${oldFileData}`);
    create(currentPath, `${newPath.trim()}${path.sep}${fileName}`);

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
    await rm(`${currentPath}${path.sep}${deleteFileData}`.trim());
  } catch (ex) {
    console.error(ex);
  }
};
