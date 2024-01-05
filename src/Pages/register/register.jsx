import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false); // Initialize with false for checkboxes

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(!isChecked); // Toggle the checkbox value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!name.trim()) {
      hasError = true;
    }

    if (!email.trim()) {
      hasError = true;
    }

    if (!password.trim()) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/register`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            email,
            password,
            role: isChecked ? 0 : 1,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        navigate("/login");
      } else {
        console.log("Registration failed:", data.message);
        alert("User not created. Please try again.");
      }
    } catch (error) {
      console.log("Error occurred during registration:", error);
      alert("An error occurred. Please try again later.");
    }

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page container">
      <div className="left-section"></div>

      <div className="right-section">
        <h2 className="right">Signup</h2>
        <p>
          Please Fill in your Name, Email, and Password
          <br /> to create a new account
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
          />

          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />

          <label>
            As a user
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </label>

          <button className="button1" type="submit">
            Create Account
          </button>

          <div className="Account">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
