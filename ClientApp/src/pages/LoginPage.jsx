import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./LoginPage.css"
import { useAuth } from "../middleware/authContext";

const LoginPage = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();
  const { toggleLogin } = useAuth();

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
      toggleLogin();
      setTimeout(() => {
        navigate("/questions");
      }, 1000);
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
      <div className="d-flex justify-content-center mb-3">
        <form className="form-style" onSubmit={handleSubmit}>
        <h2 className="mb-3 signup-text">Login</h2>
        <div className="form-group">
          <label>Email:</label>
          <input className="form-control"
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input className="form-control"
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleInputChange}
            required
          />
        </div>
        {err && <div className="error">{err}</div>}
        <button className="btn btn-primary" type="submit">Login</button>
        <div className="links mt-3">
        <a className="d-flex justify-content-center" href="/forgotpassword">Forgot Password?</a>
        <a className="d-flex justify-content-center" href="/register">Register</a>
      </div>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;
