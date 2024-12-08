import React, { useEffect, useState } from 'react';

const Logout = ({ onLogout }) => {
    const [message, setMessage] = useState("");

    useEffect(()=>{
        const performLogout = async () => {
            try{
                const response = await fetch('http://localhost:8080/logout', {
                    method: 'GET',
                    credentials: 'include',
                });
                const result = await response.json();
                console.log(result);
                if (result.success) {
                    setMessage('Logout successful!');
                    onLogout();
                    setTimeout(()=>{
                        window.location.href="/login";
                    }, 2000);
                }else{
                    setMessage(result.message || 'Logot failed!');
                }
            } catch (error) {
                setMessage('An error occurred. Please try again later.');
            }
        };
        performLogout();
    },[onLogout]);
    return (
       <div style={{with: '300px', margin: '50px auto'}}>
           <h2>Logout</h2>
           {message && <p>{message}</p>}
       </div>
    );
};
export default Logout;