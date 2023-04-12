import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPasswordPage.css"
import axios from "axios";

const ForgotPasswordPage = () => {
  const [inputs, setInputs] = useState({
    email: "",
  });

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

    if (inputs.email === "") {
      toast.error("Please fill in the email field", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.post("/api/account/forgotpassword", inputs);
      toast.success("Password reset instructions have been sent to your email", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(error.response.data, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="forgot-password-page">
      <ToastContainer />
      <h2>Forgot Password</h2>
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
        <button className="button-forgot" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
