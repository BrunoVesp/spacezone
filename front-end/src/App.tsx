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

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
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
            
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter >

  )
}

export default App;
