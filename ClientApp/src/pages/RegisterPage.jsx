import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css"
import axios from "axios";

const RegisterPage = () => {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        passwordRepeat: "",
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

        try {
            const response = await axios.post("/api/account/register", inputs);
            toast.success(response.data, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });
            setTimeout(() => {
                navigate("/login");
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
        <div className="register-page d-flex">
            <ToastContainer />
            <form className="form" onSubmit={handleSubmit}>
            <h2 className="register-text mb-3">Create account</h2>
                <div className="form-group">
                    <label>UserName:</label>
                    <input className="form-control"
                        type="text"
                        name="username"
                        value={inputs.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label>Repeat Password:</label>
                    <input className="form-control"
                        type="password"
                        name="passwordRepeat"
                        value={inputs.passwordRepeat}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {err && <div className="error">{err}</div>}
                <button className="btn btn-primary" type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;