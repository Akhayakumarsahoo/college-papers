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
import Login from "./components/UserAuth/LoginPage";
import Profile from "./components/Profile";
import ShowPost from "./components/Posts/ShowPost";
import AllPosts from "./components/Posts/AllPosts";
import EditPost from "./components/Posts/EditPost";
import CreatePost from "./components/Posts/CreatePost";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<LandingPage />} />
      <Route path="posts/:department" element={<AllPosts />}></Route>
      <Route path="posts/:department/:id" element={<ShowPost />} />
      <Route path="posts/:department/:id/edit" element={<EditPost />} />
      <Route path="create" element={<CreatePost />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="user/:userid" element={<Profile />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
