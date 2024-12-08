import React, { useEffect, useState} from 'react';

const User = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("http://localhost:8080/user", {
                    method: "GET",
                    credentials: "include",
                });
                console.log("Response Status:", response.status);
                const result = await response.json();
                if (result.success) {
                    setUserInfo(result);
                } else {
                    setError(result.message || "Failed to fetch user information.");
                }
            } catch (err) {
                setError("An error occurred. Please try again.");
            }
        };
        fetchUserInfo();
    }, []);

    if (error) {
        return <div className="container"><p className="error">{error}</p></div>;
    }

    if (!userInfo) {
        return <div className="container"><p>Loading user information...</p></div>;
    }

    return (
        <div className="container">
            <h1>User Information</h1>
            <p>Username: {userInfo.username}</p>
            <p>Last Login: {userInfo.lastLoginTime}</p>
        </div>
    );
};

export default User;