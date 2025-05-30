import "./login.scss";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    // Frontend validation
    if (!username || !password) {
      alert("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      alert("Username must be at least 3 characters long");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest.post("auth/login", {
        username,
        password,
      });

      updateUser(res.data);
      alert("Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong!");
      alert("Login failed! Please enter the correct username and password that you registered with.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Password"
          />
          <button disabled={IsLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} have an account?/Register</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
