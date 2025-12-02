import { exec } from "child_process";
import fs from "fs";

// safe for filenames
const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); 

const logFile = `logs/builds/build-${timestamp}.log`;

exec("next build --turbopack", (err, stdout, stderr) => {
  fs.writeFileSync(logFile, stdout + "\n" + stderr);
  console.log("Build complete. Log saved to:", logFile);
});
