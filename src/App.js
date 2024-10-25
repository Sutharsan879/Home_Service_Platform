import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home"; 
import Auth from "./components/Auth"; 
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ServiceProviderDashboard from "./components/ServiceProviderDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Auth />} /> 
        <Route path="/register" element={<Auth />} /> 
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/service-provider-dashboard" element={<ServiceProviderDashboard/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
