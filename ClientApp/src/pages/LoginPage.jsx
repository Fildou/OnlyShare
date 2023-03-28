import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const LoginPage = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputs.email === "" || inputs.password === "") {
      toast.error("Please fill in all fields", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post("/api/account/login", inputs);
      localStorage.setItem("token", response.data.token);
      toast.success("Successfully logged in", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/");
      }, 3100);
    } catch (error) {
      setError(error.response.data);
      toast.error(error.response.data, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleInputChange}
            required
          />
        </div>
        {err && <div className="error">{err}</div>}
        <button type="submit">Login</button>
      </form>
      <div className="links">
        <a href="/forgotpassword">Forgot Password?</a>
        <br />
        <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default LoginPage;
