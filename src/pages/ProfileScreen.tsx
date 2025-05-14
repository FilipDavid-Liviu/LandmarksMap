import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FullScreen.css";
import { useAuth } from "../contexts/AuthContext";
import { useLandmarks } from "../contexts/LandmarkContext.tsx";
import { useSelectedMarker } from "../contexts/SelectedMarkerContext.tsx";

const itemsPerPage = 8;
export const ProfileScreen: React.FC = () => {
    const { isAuthenticated, isAdmin, login, register, logout, user } =
        useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const { landmarks, savedLandmarkIds, monitoredUsers, fetchMonitoredUsers } =
        useLandmarks();
    const [errorText, setErrorText] = useState("");
    const saved = landmarks.filter((landmark) =>
        savedLandmarkIds.includes(landmark.id)
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const error = await login(username, password);
        if (error) {
            setErrorText(`*Login failed: ${error}`);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username.length < 2) {
            setErrorText("*Username must be at least 2 characters long.");
            return;
        }
        if (/[!@#$%^&*()]/.test(username)) {
            setErrorText("*Username contains invalid characters.");
            return;
        }
        if (password.length < 2) {
            setErrorText("*Password must be at least 2 characters long.");
            return;
        }

        setErrorText("");

        const error = await register(username, password);
        if (error) {
            setErrorText(`*Registration failed: ${error}`);
        }
    };

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            fetchMonitoredUsers();
        }
    }, [isAuthenticated, isAdmin]);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(saved.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedLandmarks = saved.slice(startIndex, endIndex);

    const { setSelectedMarker } = useSelectedMarker();
    const navigate = useNavigate();
    const handleLandmarkClick = (landmark: any) => {
        setSelectedMarker(landmark);
        navigate("/");
    };

    return (
        <div className="full-screen-container">
            <div className="main-content">
                {/* Map Background */}
                <div className="map-background">
                    {/* Form Section */}
                    <div className="form-section">
                        <div className="form-container">
                            {/* Left Column (Login/Register Forms) */}
                            <div className="left-column">
                                {!isAuthenticated ? (
                                    <div>
                                        {/* Toggle between login and register forms */}
                                        {isRegistering ? (
                                            <div className="auth-form-container">
                                                <h2>Register</h2>
                                                <form
                                                    className="auth-form"
                                                    onSubmit={handleRegister}
                                                >
                                                    <input
                                                        className="auth-input"
                                                        type="text"
                                                        placeholder="Username"
                                                        value={username}
                                                        onChange={(e) =>
                                                            setUsername(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        className="auth-input"
                                                        type="password"
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className="auth-button"
                                                        type="submit"
                                                    >
                                                        Register
                                                    </button>
                                                </form>
                                                <p
                                                    className={`error-message ${
                                                        errorText ? "" : "inv"
                                                    }`}
                                                >
                                                    {errorText}
                                                </p>
                                                <p className="auth-toggle-text">
                                                    Already have an account?{" "}
                                                    <button
                                                        className="auth-button"
                                                        onClick={() => {
                                                            setIsRegistering(
                                                                false
                                                            );
                                                            setErrorText("");
                                                        }}
                                                    >
                                                        Login here
                                                    </button>
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="auth-form-container">
                                                <h2>Login</h2>
                                                <form
                                                    className="auth-form"
                                                    onSubmit={handleLogin}
                                                >
                                                    <input
                                                        className="auth-input"
                                                        type="text"
                                                        placeholder="Username"
                                                        value={username}
                                                        onChange={(e) =>
                                                            setUsername(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        className="auth-input"
                                                        type="password"
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className="auth-button"
                                                        type="submit"
                                                    >
                                                        Login
                                                    </button>
                                                </form>
                                                <p
                                                    className={`error-message ${
                                                        errorText ? "" : "inv"
                                                    }`}
                                                >
                                                    {errorText}
                                                </p>
                                                <p className="auth-toggle-text">
                                                    Don't have an account?{" "}
                                                    <button
                                                        className="auth-button"
                                                        onClick={() => {
                                                            setIsRegistering(
                                                                true
                                                            );
                                                            setErrorText("");
                                                        }}
                                                    >
                                                        Register here
                                                    </button>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="auth-form-container">
                                            <h2>Hello {user}</h2>
                                            <button
                                                className="auth-button"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                        {isAdmin && (
                                            <div className="monitored-users-section">
                                                <h3>Monitored Users</h3>
                                                {monitoredUsers.length > 0 ? (
                                                    <ul className="monitored-list">
                                                        {monitoredUsers.map(
                                                            (user: any) => (
                                                                <li
                                                                    key={
                                                                        user.id
                                                                    }
                                                                    className="landmark-item"
                                                                >
                                                                    {
                                                                        user.username
                                                                    }{" "}
                                                                    (Id:{" "}
                                                                    {user.id})
                                                                    {user.is_admin && (
                                                                        <span>
                                                                            {
                                                                                " - "
                                                                            }
                                                                            (Admin)
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <p>
                                                        No suspicious users
                                                        detected.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="right-column">
                                {isAuthenticated && (
                                    <>
                                        {displayedLandmarks.length > 0 ? (
                                            <ul className="landmark-list">
                                                {displayedLandmarks.map(
                                                    (
                                                        landmark: any,
                                                        index: number
                                                    ) => (
                                                        <li
                                                            key={index}
                                                            className="landmark-item clickable"
                                                            onClick={() =>
                                                                handleLandmarkClick(
                                                                    landmark
                                                                )
                                                            }
                                                        >
                                                            <b>
                                                                {landmark.name}
                                                            </b>{" "}
                                                            ({landmark.type}) :{" "}
                                                            {
                                                                landmark.description
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            <ul className="landmark-list">
                                                <li className="landmark-item">
                                                    No saved landmarks.
                                                </li>
                                            </ul>
                                        )}

                                        {/* Pagination Controls */}
                                        <div className="pagination">
                                            <button
                                                className="page-button"
                                                disabled={currentPage <= 1}
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (prev) => prev - 1
                                                    )
                                                }
                                            >
                                                Previous
                                            </button>
                                            <span className="page-number">
                                                Page {currentPage} of{" "}
                                                {totalPages}
                                            </span>
                                            <button
                                                className="page-button"
                                                disabled={
                                                    currentPage >= totalPages
                                                }
                                                onClick={() =>
                                                    setCurrentPage(
                                                        (prev) => prev + 1
                                                    )
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>

                                        <div className="pagination">
                                            <span>
                                                Items per page: {itemsPerPage}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
