import { createBrowserRouter } from "react-router-dom";
import AppShell from "./AppShell";
import Landing from "./pages/Landing";
import CodeReview from "./pages/CodeReview";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SessionDetails from "./pages/SessionDetails"; // 👈 added import

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Landing /> },
      { path: "review", element: <CodeReview /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "analytics", element: <Analytics /> },
      { path: "settings", element: <Settings /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      // 👇 New route for viewing old session details
      { path: "session/:id", element: <SessionDetails /> },
    ],
  },
]);

