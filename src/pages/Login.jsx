import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../services/auth";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Login.css";
import "../styles/components/Toast.css";
import GoogleIcon from "../assets/google-icon.png";
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
      toast.success("Login successful!");
      // console.log(result.data);
      if(result.data.role === 0){
        navigate("/", { replace: true });
      }
      if(result.data.role === 1){
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error("Error logging in. Please try again.");
    }
  };

  const handleLoginError = (error) => {
    console.error("Google Login Error:", error);
    toast.error("Google login failed. Please try again."); // Error toast
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div class="eight">
          <h1>News App</h1>
        </div>
        <h1>Sign In</h1>
        <p>Welcome back! Please sign in to your account.</p>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          buttonText="Sign in with Google"
          className="google-button"
          render={(props) => (
            <button
              className="google-button"
              onClick={props.onClick}
              disabled={props.disabled}
            >
              <img src={GoogleIcon} alt="Google" className="google-icon" />
              {props.buttonText}
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default Login;
