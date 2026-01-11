import reactRouterNode from "@react-router/node";
import * as serverBuild from "../build/server/index.js";

const { createRequestHandler } = reactRouterNode;

const requestHandler = createRequestHandler({
  build: serverBuild,
  mode: process.env.NODE_ENV || "production",
});

export default async function handler(req, res) {
  try {
    // Build full URL
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = new URL(req.url || "/", `${protocol}://${host}`);

    // Convert Vercel request to Web Request
    const request = new Request(url.toString(), {
      method: req.method || "GET",
      headers: new Headers(req.headers),
    });

    // Get Response from React Router
    const response = await requestHandler(request);

    // Convert Web Response to Vercel response
    res.status(response.status);

    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    if (response.body) {
      const body = await response.text();
      res.send(body);
    } else {
      res.end();
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).send("Internal Server Error");
  }
}
