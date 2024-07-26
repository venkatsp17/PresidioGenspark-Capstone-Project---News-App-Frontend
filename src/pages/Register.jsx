import { React, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Register = ({ onRegistrationSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Make API request to register the user
      const result = await axios.post(
        "https://localhost:7285/api/Authentication/UserRegister",
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

      // On success, show a success message and switch to login tab
      toast.success("Registration successful!");
      //   console.log(result.data);

      // Call the prop function to switch to the login tab
      onRegistrationSuccess();
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Error registering. Please try again.");
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
