import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import LoadingPage from "./components/LoadingPage";
import NotFoundPage from "./components/NotFoundPage";

import App from "./App";
const LandingPage = lazy(() => import("./components/HomePage"));
const Signup = lazy(() => import("./components/UserAuth/SignupPage"));
const Profile = lazy(() => import("./components/ProfilePage"));
const ShowPost = lazy(() => import("./components/Posts/ShowPost"));
const AllPosts = lazy(() => import("./components/Posts/AllPosts"));
const EditPost = lazy(() => import("./components/Posts/EditPost"));
const CreatePost = lazy(() => import("./components/Posts/CreatePost"));

import { GeneralContextProvider } from "./GeneralContext";
import { Toaster } from "@/components/ui/toaster";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route
          path=""
          element={
            <Suspense fallback={<LoadingPage />}>
              <LandingPage />
            </Suspense>
          }
          errorElement={<NotFoundPage />}
        />
        <Route
          path="posts"
          element={
            <Suspense fallback={<LoadingPage />}>
              <AllPosts />
            </Suspense>
          }
          errorElement={<NotFoundPage />}
        />
        <Route
          path="posts/:id"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ShowPost />
            </Suspense>
          }
          errorElement={<NotFoundPage />}
        />
        <Route
          path="posts/:id/edit"
          element={
            <Suspense fallback={<LoadingPage />}>
              <EditPost />
            </Suspense>
          }
          errorElement={<NotFoundPage />}
        />
        <Route
          path="posts/create"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CreatePost />
            </Suspense>
          }
          errorElement={<NotFoundPage />}
        />
        <Route
          path="signup"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Signup />
            </Suspense>
          }
          errorElement={<NotFoundPage />}
        />
        <Route
          path="user/:userid"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Profile />
            </Suspense>
          }
          errorElement={<NotFoundPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GeneralContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </GeneralContextProvider>
  </StrictMode>
);
