import { createRequestListener } from "@react-router/node";
import * as serverBuild from "../build/server/index.js";

const requestListener = createRequestListener({
  build: serverBuild,
  mode: process.env.NODE_ENV || "production",
});

export default async function handler(req, res) {
  try {
    await requestListener(req, res);
  } catch (error) {
    console.error("Error handling request:", error);
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error");
    }
  }
}
