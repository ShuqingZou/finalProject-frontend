import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import HotelSearch from "./components/HotelSearch";
import HotelDetail from "./components/HotelDetail";
import User from "./components/User";
import History from "./components/History";
import ModifyReview from "./components/ModifyReview";
import AddReview from "./components/AddReview";
import "./App.css";

const App = () => {
    const [username, setUsername] = useState(null);

    const handleLogin = (username) => {
        setUsername(username);
        console.log(username);
    };

    const handleLogout = () => {
        setUsername(null);
    };

    return (
        <Router>
            <nav className="navbar">
                <div>
                    <Link to="/" className="home-link" style={{ marginRight:"15px" }}>
                        Home
                    </Link>
                </div>
                <div>
                    {username ? (
                        <div className="header-container">
                            <Link to="/user" className="user-link">
                                <span role="img" aria-label="User icon" className="user-icon">
                                    👤
                                </span>
                                <span className="username">{username}</span>
                            </Link>
                            <Link to="/history" className="history-link">🕓</Link>
                            <Link to="/logout" className="logout-link">Logout</Link>
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    )}
                </div>
            </nav>
            <div className="content">
                <Routes>
                    <Route
                        path="/"
                        element={
                            username ? <Navigate to="/hotels" /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            username ? (<Navigate to="/hotels" />) : (<Login onLogin={handleLogin} />)
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            username ? <Navigate to="/hotels" /> : <Register />
                        }
                    />
                    <Route
                        path="/logout"
                        element={<Logout onLogout={handleLogout} />}
                    />
                    <Route path="/hotels" element={<HotelSearch />} />
                    <Route path="/hotels/:hotelId" element={<HotelDetail />} />
                    <Route
                        path="/user"
                        element={
                            username ? <User /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/history"
                        element={
                            username ? <History /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/ModifyReview"
                        element={username ? <ModifyReview /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/AddReview/:hotelId"
                        element={username ? <AddReview /> : <Navigate to="/login" />}
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
