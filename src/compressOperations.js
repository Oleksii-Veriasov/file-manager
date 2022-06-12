import { pipeline } from "node:stream/promises";
import zlib from "zlib";
import path from "node:path";
import { access, open } from "node:fs/promises";

export const compressBrotli = async (
  currentPath,
  sourceFile,
  destinationFile
) => {
  let fileName = path.basename(`${currentPath}${path.sep}${sourceFile.trim()}`);
  await access(`${currentPath}${path.sep}${sourceFile.trim()}`);
  const input = await open(`${currentPath}${path.sep}${sourceFile.trim()}`);
  const output = await open(
    `${currentPath}${path.sep}${destinationFile.trim()}${
      path.sep
    }${fileName}.br`,
    "wx"
  );
  pipeline(
    input.createReadStream(),
    zlib.createBrotliCompress({
      chunkSize: 32 * 1024,
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
      },
    }),
    output.createWriteStream()
  );
};

export const decompressBrotli = async (
  currentPath,
  sourceFile,
  destinationFile
) => {
  let fileName = path.basename(
    `${currentPath}${path.sep}${sourceFile.trim()}`,
    ".br"
  );
  await access(`${currentPath}${path.sep}${sourceFile.trim()}`);
  const input = await open(`${currentPath}${path.sep}${sourceFile.trim()}`);
  const output = await open(
    `${currentPath}${path.sep}${destinationFile.trim()}${
      path.sep
    }${fileName}`.replace("/.//", "/"),
    "wx"
  );
  pipeline(
    input.createReadStream(),
    zlib.createBrotliDecompress({
      chunkSize: 32 * 1024,
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
      },
    }),
    output.createWriteStream()
  );
};
