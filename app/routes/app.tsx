import { Navigate, Outlet, Link, useLocation } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { Loading } from "~/components/Loading";

export default function AppLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={`/login?redirectTo=${location.pathname}`} replace />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <Link to="/app/dashboard" className="btn btn-ghost text-xl">
            Lost & Found
          </Link>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <div className="flex items-center gap-2">
                <span>{user.email}</span>
                {user.role === "admin" && (
                  <span className="badge badge-primary">Admin</span>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}
