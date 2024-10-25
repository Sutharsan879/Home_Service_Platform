import { useState } from "react";
import { auth, database } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database"; 
import { useNavigate } from "react-router-dom";
import './Login.css'; 

const Login = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userRef = ref(database, 'users/' + user.uid);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("User data:", userData);
        if (userData.role === "Admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "Service Provider") {
          navigate("/service-provider-dashboard");
        } else if (userData.role === "User") {
          navigate("/user-dashboard");
        } else {
          throw new Error("Invalid user role");
        }

      } else {
        setError("No user data found in the database.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="simple">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>} 
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <span onClick={toggleForm} style={{ cursor: "pointer", color: "blue" }}>
          Register here
        </span>
      </p>
      </div>
    </div>
  );
};

export default Login;
