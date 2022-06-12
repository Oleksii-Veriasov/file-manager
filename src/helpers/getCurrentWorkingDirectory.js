import os from "os";

export const getCurrentPath = (currentFolder) => {
    process.stdout.write(`You are currently in ${currentFolder}${os.EOL}`);
}