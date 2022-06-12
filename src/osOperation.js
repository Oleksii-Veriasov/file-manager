import os from "os";

export const osEol = async () => {
  process.stdout.write(JSON.stringify(os.EOL) + os.EOL);
};

export const osCpu = async () => {
  let cpusData = os.cpus();
  cpusData.forEach((cpu) => process.stdout.write(JSON.stringify(cpu) + os.EOL));
};

export const osHomedir = async () => {
  process.stdout.write(os.homedir + os.EOL);
};

export const osArchitecture = async () => {
  process.stdout.write(os.arch() + os.EOL);
};
