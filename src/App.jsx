import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import About from "./pages/about/About";
import Login from "./pages/login/Login";
import Produto from "./pages/produto/Produto";
import Users from "./pages/users/Users";
import Register from "./pages/register/Register";
import Footer from "./components/Footer/Footer";
import NotFound from "./pages/notfound/NotFound";

function App() {
  const RequireAuth = ({ children, role }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || (role && user?.role !== role)) {
      return <Navigate to="*" />;
    }

    return children;
  };
  return (
    <Router>
      <div className="content-wrap">
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Login />} />
          <Route path="/products" element={<Produto />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/users"
            element={
              <RequireAuth role="ADMIN">
                <Users />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
