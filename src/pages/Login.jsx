import { React, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../services/auth";
import axios from "axios";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginFunction = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // console.log(response);
        const decoded = jwtDecode(response.credential);
        // console.log(decoded);
        // console.log(decoded["email"]);
        const result = await axios.post(
          "https://localhost:7285/api/Authentication/login",
          {
            oAuthToken: response.credential,
            email: decoded["email"],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        login(result.data);
        toast.success("Login successful!");
        console.log(result.data);
        if (result.data.role === 0) {
          navigate("/", { replace: true });
        }
        if (result.data.role === 1) {
          navigate("/admin", { replace: true });
        }
      } catch (error) {
        console.error("Error logging in with Google:", error);
        toast.error("Error logging in. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast.error("Google login failed. Please try again."); // Error toast
    },
  });

  const handleEmailLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    try {
      const result = await axios.post(
        "https://localhost:7285/api/Authentication/UserLogin",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      login(result.data);
      toast.success("Login successful!");
      if (result.data.role === 0) {
        navigate("/", { replace: true });
      }
      if (result.data.role === 1) {
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Error logging in. Please try again.");
    }
  };

  return (
    <div className="tab-pane fade show active">
      <form onSubmit={handleEmailLogin}>
        <div className="text-center mb-3">
          <p>Sign in with:</p>
          <button type="button" className="btn btn-link btn-floating mx-1">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button
            type="button"
            className="btn btn-link btn-floating mx-1"
            // onClick={loginFunction}
          >
            <i className="fab fa-google"></i>
          </button>
          <button type="button" className="btn btn-link btn-floating mx-1">
            <i className="fab fa-twitter"></i>
          </button>
          <button type="button" className="btn btn-link btn-floating mx-1">
            <i className="fab fa-github"></i>
          </button>
        </div>
        <p className="text-center">or:</p>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="loginName">
            Email
          </label>
          <input
            type="email"
            id="loginName"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="loginPassword">
            Password
          </label>
          <input
            type="password"
            id="loginPassword"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block mb-4 w-100">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Login;
