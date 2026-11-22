import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_AUTH_SECRET || "cloche_master_jwt_secret_key_2026_super_secure_key_84920";

function signJwt(payload) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 30 * 24 * 60 * 60;
  const fullPayload = { ...payload, iat, exp };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signatureInput = `${header}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest("base64url");
  return `${signatureInput}.${signature}`;
}

async function captureWithCdp(url, cookies, outputPath) {
  const tempProfileDir = path.join(process.cwd(), "scratch", "temp_edge_profile_" + Date.now());
  fs.mkdirSync(tempProfileDir, { recursive: true });

  const port = 9222 + Math.floor(Math.random() * 100);
  const browserProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${port}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${tempProfileDir}`,
    "about:blank",
  ]);

  try {
    // Wait for devtools port
    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 400));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/list`);
        const json = await res.json();
        if (json[0]?.webSocketDebuggerUrl) {
          wsUrl = json[0].webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!wsUrl) throw new Error("Could not connect to Edge DevTools WebSocket");

    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send("Page.enable");
    await send("Network.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    for (const c of cookies) {
      await send("Network.setCookie", {
        name: c.name,
        value: c.value,
        domain: "localhost",
        path: "/",
      });
    }

    await send("Page.navigate", { url });
    // Wait 4 seconds for react hydration & API data load
    await new Promise((r) => setTimeout(r, 4000));

    const screenshotResult = await send("Page.captureScreenshot", { format: "png" });
    if (screenshotResult?.data) {
      fs.writeFileSync(outputPath, Buffer.from(screenshotResult.data, "base64"));
      console.log(`Saved screenshot to: ${outputPath}`);
    } else {
      console.warn("Screenshot capture returned no data");
    }

    ws.close();
  } finally {
    browserProc.kill();
    setTimeout(() => {
      try {
        fs.rmSync(tempProfileDir, { recursive: true, force: true });
      } catch (e) {}
    }, 1000);
  }
}

async function main() {
  const amrasVendorId = "dee739bc-7b2f-488e-bf14-96d1fc9e8112";
  const amrasUserId = "0ff5befd-1ad9-42fe-921e-01d65b263e41";
  const aishaUserId = "a3ba05ee-81b9-4f50-94e5-cf9ece34de7d";

  const aishaToken = signJwt({
    userId: aishaUserId,
    email: "aisha.wedding@cloche.luxury",
    fullName: "Aisha",
    role: "customer",
  });

  const amrasToken = signJwt({
    userId: amrasUserId,
    email: "lala@gmail.com",
    role: "vendor",
    fullName: "Amras Ameen",
  });

  // 1. Aisha Message Center Screenshot
  console.log("Capturing Aisha Message Center...");
  await captureWithCdp(
    "http://localhost:3099/messages",
    [
      { name: "cloche_auth_token", value: aishaToken },
      { name: "auth_token", value: aishaToken },
      { name: "user_role", value: "customer" },
      {
        name: "user_data",
        value: JSON.stringify({
          userId: aishaUserId,
          email: "aisha.wedding@cloche.luxury",
          name: "Aisha",
          fullName: "Aisha",
          role: "customer",
        }),
      },
    ],
    path.join("C:\\Users\\hp\\.gemini\\antigravity\\brain\\6e41484a-e40c-4aef-a1da-dccfb2ee174c", "aisha_message_center_verified.png")
  );

  // 2. Amras Ameen Dashboard Messages Screenshot
  console.log("Capturing Amras Photographer Dashboard Messages...");
  await captureWithCdp(
    "http://localhost:3099/partner#dashboard",
    [
      { name: "cloche_auth_token", value: amrasToken },
      { name: "auth_token", value: amrasToken },
      { name: "user_role", value: "vendor" },
      {
        name: "user_data",
        value: JSON.stringify({
          userId: amrasUserId,
          email: "lala@gmail.com",
          name: "Amras Ameen",
          fullName: "Amras Ameen",
          role: "vendor",
          vendorId: amrasVendorId,
        }),
      },
    ],
    path.join("C:\\Users\\hp\\.gemini\\antigravity\\brain\\6e41484a-e40c-4aef-a1da-dccfb2ee174c", "amras_photographer_messages_verified.png")
  );

  console.log("Screenshots captured successfully!");
}

main().catch(console.error);

