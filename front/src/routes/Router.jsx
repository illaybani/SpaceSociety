import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import ROUTES from "./ROUTES";
import LoginPage from "../pages/LoginPage";
import EditCardPage from "../pages/EditCardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import SuperProtectedRoute from "../components/SuperProtectedRoute";
import LogoutPage from "../pages/LogoutPage";
import SearchFriends from "../pages/SearchFriends";
import PostsPage from "../pages/PostsPage";
import SavedPostsPage from "../pages/SavedPostsPage";
import EditProfile from "../pages/EditProfile";
import Planets from "../pages/Planets";
import JamesWebb from "../pages/JamesWebb";
import CreatedPosts from "../pages/CreatedPosts";
import Profile from "../components/Profile";
import CRM from "../pages/CRM";
import ReadMe from "../pages/readme";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Router = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === ROUTES.HOME) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route
        path={ROUTES.LOGOUT}
        element={<ProtectedRoute element={<LogoutPage />} />}
      />
      <Route
        path="/my-posts/:id"
        element={
          <SuperProtectedRoute isAdmin={true} element={<EditCardPage />} />
        }
      />

      <Route
        path={ROUTES.SEARCH}
        element={<ProtectedRoute element={<SearchFriends />} />}
      />
      <Route
        path={ROUTES.POSTS}
        element={<ProtectedRoute element={<PostsPage />} />}
      />
      <Route
        path={ROUTES.SAVEDPOSTS}
        element={<ProtectedRoute element={<SavedPostsPage />} />}
      />
      <Route
        path={ROUTES.MYPOSTS}
        element={<ProtectedRoute element={<CreatedPosts />} />}
      />
      <Route
        path={ROUTES.EDITINFO}
        element={<ProtectedRoute element={<EditProfile />} />}
      />
      <Route path={ROUTES.CRM} element={<ProtectedRoute element={<CRM />} />} />
      <Route
        path={ROUTES.PROFILE}
        element={<ProtectedRoute element={<Profile />} />}
      />
      <Route
        path={ROUTES.PLANETS}
        element={<ProtectedRoute element={<Planets />} />}
      />
      <Route
        path={ROUTES.JAMESWEBB}
        element={<ProtectedRoute element={<JamesWebb />} />}
      />
      <Route path={ROUTES.README} element={<ReadMe />} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
};

export default Router;
