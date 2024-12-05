import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GeneralContextProvider } from "./Context/GeneralContext";
import { Toaster } from "@/components/ui/toaster";

import "./index.css";
import App from "./App";
import LoadingPage from "./components/LoadingPage";
import NotFoundPage from "./components/NotFoundPage";

// Lazy-loaded Components
const LandingPage = lazy(() => import("./components/HomePage"));
const Signup = lazy(() => import("./components/UserAuth/SignupPage"));
const Profile = lazy(() => import("./components/ProfilePage"));
const ShowPost = lazy(() => import("./components/Posts/ShowPost"));
const AllPosts = lazy(() => import("./components/Posts/AllPosts"));
const EditPost = lazy(() => import("./components/Posts/EditPost"));
const CreatePost = lazy(() => import("./components/Posts/CreatePost"));

// Routes Component
const Routes = () => (
  <Suspense fallback={<LoadingPage />}>
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <App />,
          errorElement: <NotFoundPage />,
          children: [
            { index: true, element: <LandingPage /> },
            { path: "signup", element: <Signup /> },
            { path: "user/:userid", element: <Profile /> },
            { path: "posts", element: <AllPosts /> },
            { path: "posts/:id", element: <ShowPost /> },
            { path: "posts/:id/edit", element: <EditPost /> },
            { path: "posts/create", element: <CreatePost /> },
          ],
        },
        { path: "*", element: <NotFoundPage /> },
      ])}
    />
  </Suspense>
);

// Root Element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Render Application
createRoot(rootElement).render(
  <StrictMode>
    <GeneralContextProvider>
      <Routes />
      <Toaster />
    </GeneralContextProvider>
  </StrictMode>
);
