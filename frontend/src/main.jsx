import { StrictMode } from "react";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="" element={<LandingPage />} />
        <Route path="posts" element={<AllPosts />} />
        <Route
          path="posts/:id"
          element={<ShowPost />}
          errorElement={<NotFoundPage />}
        />
        <Route path="posts/:id/edit" element={<EditPost />} />
        <Route path="create" element={<CreatePost />} />
        <Route path="signup" element={<Signup />} />
        <Route path="user/:userid" element={<Profile />} />
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
