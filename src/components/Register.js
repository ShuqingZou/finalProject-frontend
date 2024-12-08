import React, { useState } from "react";
import "./Login.css"

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8 || password.length > 16) {
            setMessage("Password must be between 8 and 16 characters.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setMessage("Registration successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/login"; // Redirect to login page
                }, 2000);
            } else {
                setMessage(result.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            setMessage("Network error. Please try again later.");
        }
    };
    return (
        <div className="container">
            <div className="jumbotron">
                <h1>MyTravelAdvisor</h1>
                <h3>Register to Explore</h3>
            </div>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <small>Password must be between 8 and 16 characters.</small>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;