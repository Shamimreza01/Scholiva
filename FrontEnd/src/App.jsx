import React, { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import { ToastProvider } from "./context/ToastContext";

// Lazy Load Pages for Performance
const Feed = lazy(() => import("./pages/Feed"));
const MyLearning = lazy(() => import("./pages/MyLearning"));
const Quizzes = lazy(() => import("./pages/Quizzes"));
const Classrooms = lazy(() => import("./pages/Classrooms"));
const ClassroomDetail = lazy(() => import("./pages/ClassroomDetail"));
const Requests = lazy(() => import("./pages/Requests"));
const UserSearch = lazy(() => import("./pages/UserSearch"));
const AssessmentStudio = lazy(() => import("./pages/AssessmentStudio"));
const CreateQuiz = lazy(() => import("./pages/CreateQuiz"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const Rankings = lazy(() => import("./pages/Rankings"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

// Compact Loading State
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
  </div>
);

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/",
    errorElement: (
      <Suspense fallback={<PageLoader />}>
        <ErrorPage />
      </Suspense>
    ),
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/feed" /> },
      {
        path: "feed",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Feed />
          </Suspense>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Feed />
          </Suspense>
        ),
      },
      {
        path: "my-learning",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MyLearning />
          </Suspense>
        ),
      },
      {
        path: "quizzes",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Quizzes />
          </Suspense>
        ),
      },
      {
        path: "classrooms",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Classrooms />
          </Suspense>
        ),
      },
      {
        path: "classroom/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ClassroomDetail />
          </Suspense>
        ),
      },
      {
        path: "requests",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Requests />
          </Suspense>
        ),
      },
      {
        path: "search",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserSearch />
          </Suspense>
        ),
      },
      {
        path: "assessment-studio",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssessmentStudio />
          </Suspense>
        ),
      },
      {
        path: "create-quiz",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateQuiz />
          </Suspense>
        ),
      },
      {
        path: "edit-quiz/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateQuiz />
          </Suspense>
        ),
      },
      {
        path: "user/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfileSettings />
          </Suspense>
        ),
      },
      {
        path: "rankings/:quizId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Rankings />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/quiz/:quizId",
    element: (
      <PrivateRoute>
        <Suspense fallback={<PageLoader />}>
          <QuizPage />
        </Suspense>
      </PrivateRoute>
    ),
  },
]);

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
