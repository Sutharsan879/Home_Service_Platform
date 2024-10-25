import { useState } from "react";
import { auth, database } from "../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database"; 
import './Auth.css'; 

const Register = ({ toggleForm }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState(""); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await set(ref(database, 'users/' + user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
      });

      alert(`Welcome, ${firstName}! You have successfully registered.`);

      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        firstName,
        lastName,
        email,
        role,
      }));

      if (role === "Admin") {
        window.location.href = "/admin-dashboard";
      } else if (role === "Service Provider") {
        window.location.href = "/service-provider-dashboard"; 
      } else {
        window.location.href = "/user-dashboard"; 
      }

    } catch (error) {
      console.error("Error registering:", error);
      setError("Error registering: " + error.message); 
    }
  };

  return (
    <div className="auth-container register">
      
      <div className="simple">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Service Provider">Service Provider</option>
        </select>
        {error && <p className="error-message">{error}</p>} 
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <span onClick={toggleForm} style={{ cursor: "pointer", color: "blue" }}>
          Login here
        </span>
      </p>
      </div>
    </div>
  );
};

export default Register;
