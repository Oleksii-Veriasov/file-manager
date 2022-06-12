import { argv } from "node:process";
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
import { calculateHash } from "./hashOperation.js";
import { compressBrotli, decompressBrotli } from "./compressOperations.js";

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

  process.stdin.on("data", (chunk) => {
    let chunkToString = chunk.toString().trim();
    if (chunkToString === "ls") {
      list(currentFolder);
      getCurrentPath(currentFolder);
    }
    else if (chunkToString === "up") {
      goUp(currentFolder, userHomeFolder);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    else if (chunkToString.startsWith("cd")) {
      const pathToGoData = chunk.toString().split(" ");
      goTo(currentFolder, pathToGoData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    else if (chunkToString.startsWith("cut")) {
      let pathToFileData = decodeURIComponent(chunk.toString()).substring(4);
      read(currentFolder, pathToFileData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    else if (chunkToString.startsWith("add")) {
      let newFileData = decodeURIComponent(chunk.toString()).substring(4);
      create(currentFolder, newFileData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    else if (chunkToString.startsWith("rn")) {
      let renameFileData = decodeURIComponent(chunk.toString()).substring(3);
      let oldFileData = renameFileData.split(" ")[0];
      let newFileData = renameFileData.split(" ")[1];
      rename(currentFolder, oldFileData, newFileData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    else if (chunkToString.startsWith("mv")) {
      let renameFileData = decodeURIComponent(chunk.toString()).substring(3);
      let oldFileData = renameFileData.split(" ")[0];
      let newPath = renameFileData.split(" ")[1];
      moveFile(currentFolder, oldFileData, newPath);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    else if (chunkToString.startsWith("rm")) {
      let deleteFileData = decodeURIComponent(chunk.toString()).substring(3);
      deleteFile(currentFolder, deleteFileData);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }

    else if (chunkToString.startsWith("os --EOL")) {
      osEol();
    }
    else if (chunkToString.startsWith("os --cpus")) {
      osCpu();
    }
    else if (chunkToString.startsWith("os --homedir")) {
      osHomedir();
    }
    else if (chunkToString.startsWith("os --architecture")) {
      osArchitecture();
    }

    else if (chunkToString.startsWith("hash")) {
      let fileHashCalc = decodeURIComponent(chunk.toString()).substring(5);
      calculateHash(currentFolder, fileHashCalc);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }

    else if (chunkToString.startsWith("compress")) {
      let compressData = decodeURIComponent(chunk.toString()).substring(9);
      let sourceFile = compressData.split(" ")[0];
      let destinationFolder = compressData.split(" ")[1];
      compressBrotli(currentFolder, sourceFile, destinationFolder);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    else if (chunkToString.startsWith("decompress")) {
      let decompressData = decodeURIComponent(chunk.toString()).substring(11);
      let sourceFile = decompressData.split(" ")[0];
      let destinationFolder = decompressData.split(" ")[1];
      decompressBrotli(currentFolder, sourceFile, destinationFolder);
      currentFolder = process.cwd();
      getCurrentPath(currentFolder);
    }
    
    else if (chunkToString === ".exit") {
      process.stdout.write(
        `Thank you for using File Manager, ${username}!${os.EOL}`
      );
      process.exit();
    } else {
      process.stdout.write(`Invalid input${os.EOL}`);
    }
  });

  process.on("SIGINT", () => {
    process.stdout.write(
      `${os.EOL}Thank you for using File Manager, ${username}!${os.EOL}`
    );
    process.exit();
  });
};
startManager();
