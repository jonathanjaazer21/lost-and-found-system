import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  layout("routes/app.tsx", [
    route("app/dashboard", "routes/app.dashboard.tsx"),
  ]),
  // API routes for email notifications
  route("api/notify-create", "routes/api.notify-create.tsx"),
  route("api/notify-update", "routes/api.notify-update.tsx"),
] satisfies RouteConfig;
