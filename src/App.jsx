import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />         {/* Home Page */}
        <Route path="/signup" element={<Signup />} /> {/* Signup Page */}
        <Route path="/login" element={<Login />} />   {/* Login Page */}
      </Routes>
    </Router>
  );
}

export default App;
