import { React, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../utils/constants";

const Register = ({ onRegistrationSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Make API request to register the user
      await axios.post(
        `${apiUrl}/Authentication/UserRegister`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Registration successful!");
      onRegistrationSuccess();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;

        Object.values(validationErrors).forEach((errorMessages) => {
          errorMessages.forEach((message) => {
            toast.error(message);
          });
        });
      } else if (error.response.data.message) {
        const message = error.response.data.message;

        toast.error(message);
      } else {
        toast.error("Error registering. Please try again.");
      }
    }
  };

  return (
    <div className="tab-pane fade show active">
      <form onSubmit={handleRegister}>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="registerName">
            Name
          </label>
          <input
            type="text"
            id="registerName"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="registerEmail">
            Email
          </label>
          <input
            type="email"
            id="registerEmail"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="registerPassword">
            Password
          </label>
          <input
            type="password"
            id="registerPassword"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn w-100 btn-primary btn-block mb-3">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Register;
