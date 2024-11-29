import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "./App.jsx";
import LandingPage from "./components/HomePage";
import Signup from "./components/UserAuth/SignupPage";
import Profile from "./components/ProfilePage";
import ShowPost from "./components/Posts/ShowPost";
import AllPosts from "./components/Posts/AllPosts";
import EditPost from "./components/Posts/EditPost";
import CreatePost from "./components/Posts/CreatePost";
import { GeneralContextProvider } from "./GeneralContext";
import { Toaster } from "@/components/ui/toaster";
import NotFoundPage from "./components/NotFoundPage";
import LoadingPage from "./LoadingPage";

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
          path="create"
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
