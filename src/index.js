import { argv, stdin, stdout } from "node:process";
import * as readline from "node:readline";
import os from "os";
import { getCurrentPath } from "./helpers/getCurrentWorkingDirectory.js";
import { list, goUp, goTo } from "./navigation/navigation.js";
import {
  read,
  create,
  rename,
  deleteFile,
  moveFile,
} from "./fileOperations/fileOperations.js";
import { osEol, osCpu, osHomedir, osArchitecture } from "./osOperation.js";

export const startManager = async () => {
  let username;
  const userHomeFolder = os.homedir() || process.env.HOME;
  let currentFolder = userHomeFolder;

  await process.chdir(userHomeFolder);

  argv[2].substring(2).toString().startsWith("username=")
    ? (username = argv[2].substring(11))
    : (username = User);
  process.stdout.write(`Welcome to the File Manager, ${username}!${os.EOL}`);

  getCurrentPath(currentFolder);
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // try {
  process.stdin.on("data", (chunk) => {
    if (chunk.toString().trim() === "ls") {
      // console.log("---------------------", chunk.toString());
      list(currentFolder);
      getCurrentPath(currentFolder);
    }
    if (chunk.toString().trim() === "up") {
      // console.log("---------------------", chunk.toString());
      // console.log("currentFolder: ", currentFolder);
      // console.log("userHomeFolder: ", userHomeFolder);
      goUp(currentFolder, userHomeFolder);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    if (chunk.toString().startsWith("cd")) {
      const pathToGoData = chunk.toString().split(" ");
      // console.log(pathToGoData);
      // console.log("currentFolder: ", currentFolder);
      // console.log("userHomeFolder: ", userHomeFolder);
      goTo(currentFolder, pathToGoData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    if (chunk.toString().startsWith("cut")) {
      let pathToFileData = decodeURIComponent(chunk.toString()).substring(4);
      console.log(pathToFileData);
      read(currentFolder, pathToFileData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    if (chunk.toString().startsWith("add")) {
      let newFileData = decodeURIComponent(chunk.toString()).substring(4);
      console.log(newFileData);
      create(currentFolder, newFileData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    if (chunk.toString().startsWith("rn")) {
      let renameFileData = decodeURIComponent(chunk.toString()).substring(3);
      let oldFileData = renameFileData.split(" ")[0];
      let newFileData = renameFileData.split(" ")[1];
      console.log(newFileData);
      rename(currentFolder, oldFileData, newFileData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    if (chunk.toString().startsWith("mv")) {
      let renameFileData = decodeURIComponent(chunk.toString()).substring(3);
      let oldFileData = renameFileData.split(" ")[0];
      let newPath = renameFileData.split(" ")[1];
      console.log(newPath);
      moveFile(currentFolder, oldFileData, newPath);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    if (chunk.toString().startsWith("rm")) {
      let deleteFileData = decodeURIComponent(chunk.toString()).substring(3);
      console.log(deleteFileData);
      deleteFile(currentFolder, deleteFileData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    if (chunk.toString().startsWith("os --EOL")) {
      osEol();
    }
    if (chunk.toString().startsWith("os --cpus")) {
      osCpu();
    }
    if (chunk.toString().startsWith("os --homedir")) {
      osHomedir();
    } 
    if (chunk.toString().startsWith("os --architecture")) {
      osArchitecture();
    } 
  });
  //   });
  //   process.stdin.on('error', (err)=>{throw err})
  // } catch (ex) {
  //   console.log(ex)
  //   console.error(ex.message);
  // }

  // ++++++++++++++++++++++++++++++++++++++
  // console.log(process.cwd());

  //   console.log(userHomeFolder);
  //   console.log(process.env.USERPROFILE);
  process.on("SIGINT", () => {
    process.stdout.write(
      `${os.EOL}Thank you for using File Manager, ${username}!${os.EOL}`
    );
    process.exit();
  });
  process.stdin.on("data", (chunk) => {
    const chunkToString = chunk.toString().trim();
    if (chunkToString === ".exit") {
      process.stdout.write(
        `Thank you for using File Manager, ${username}!${os.EOL}`
      );
      process.exit();
    }
  });
};
startManager();
