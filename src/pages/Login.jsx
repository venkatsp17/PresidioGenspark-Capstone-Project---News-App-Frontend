import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../services/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = async (response) => {
    try {
      const result = await axios.post(
        "https://localhost:7285/api/Authentication/login",
        {
          oAuthToken: response.credential,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      login(result.data);
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.error("Login Failed")}
      />
    </div>
  );
};

export default Login;
