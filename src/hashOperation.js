import crypto from "node:crypto";
import fs from "fs/promises";
import path from "node:path";
import os from "os";

export const calculateHash = async (currentFolder, fileHashCalc) => {
  let file = await fs.readFile(`${currentFolder}${path.sep}${fileHashCalc.trim()}`);
  let hash = crypto.createHash("sha256");
  process.stdout.write(hash.update(file).digest("hex")+os.EOL);
};
