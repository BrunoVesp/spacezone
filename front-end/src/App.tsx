import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layout/layout";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastProvider } from "./components/Toast/ToastProvider";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdmLogin from "./pages/AdmLogin";
import Dashboard from "./pages/Dashboard";
import RedatorRoute from "./routes/RedatorRoute";
import Post from "./pages/Post";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:id" element={<Post />} />
            <Route path="/sobre-nos" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/adm-login" element={<AdmLogin />} />

            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RedatorRoute>
                  <Dashboard />
                </RedatorRoute>
              }
            />

          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter >

  )
}

export default App;
