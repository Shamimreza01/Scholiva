import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import { ToastProvider } from "./context/ToastContext";
import ClassroomDetail from "./pages/ClassroomDetail";
import Classrooms from "./pages/Classrooms";
import CreateQuiz from "./pages/CreateQuiz";
import Feed from "./pages/Feed";
import FindTeachers from "./pages/FindTeachers";
import Login from "./pages/Login";
import MyLearning from "./pages/MyLearning";
import ProfileSettings from "./pages/ProfileSettings";
import QuizPage from "./pages/QuizPage";
import Rankings from "./pages/Rankings";
import Register from "./pages/Register";
import Requests from "./pages/Requests";
import UserProfile from "./pages/UserProfile";

function App() {
  const PrivateRoute = ({ children }) => {
    return localStorage.getItem("token") ? children : <Navigate to="/login" />;
  };

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main App Layout with Sub-Routes */}
          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/feed" element={<Feed />} />
            <Route path="/dashboard" element={<Feed />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/classrooms" element={<Classrooms />} />
            <Route path="/classroom/:id" element={<ClassroomDetail />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/find-teachers" element={<FindTeachers />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/edit-quiz/:id" element={<CreateQuiz />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/rankings/:quizId" element={<Rankings />} />
          </Route>

          <Route
            path="/quiz/:quizId"
            element={
              <PrivateRoute>
                <QuizPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/feed" />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
