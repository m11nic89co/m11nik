const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");

const port = 4173;
const rootDir = path.resolve(__dirname, "../..");
const serverPath = path.resolve(__dirname, "static-server.js");
const playwrightCli = require.resolve("@playwright/test/cli");
const args = ["test", ...process.argv.slice(2)];

function waitForServer() {
  return new Promise((resolve, reject) => {
    const started = Date.now();

    function ping() {
      const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
        res.resume();
        resolve();
      });

      req.on("error", () => {
        if (Date.now() - started > 10000) {
          reject(new Error("Static server did not start within 10s"));
          return;
        }

        setTimeout(ping, 100);
      });
    }

    ping();
  });
}

async function run() {
  const server = spawn(process.execPath, [serverPath, String(port)], {
    cwd: rootDir,
    stdio: ["ignore", "pipe", "pipe"]
  });

  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));

  try {
    await waitForServer();

    const exitCode = await new Promise((resolve) => {
      const child = spawn(process.execPath, [playwrightCli, ...args], {
        cwd: rootDir,
        stdio: "inherit"
      });

      child.on("close", resolve);
    });

    server.kill();
    process.exit(exitCode);
  } catch (error) {
    server.kill();
    console.error(error.message);
    process.exit(1);
  }
}

run();
