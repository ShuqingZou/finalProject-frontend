import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./AddReview.css";

const AddReview = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        const params = new URLSearchParams({
            rating: rating,
            hotelId: hotelId,
            title: title,
            text: text,
        });
        try{
            const response = await fetch(`/addReview?${params}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
            });
            const result = await response.json();
            if(result.success) {
                navigate(`/hotels/${hotelId}`);
            }else{
                setMessage(result.message || "An error occorred.");
            }
        }catch(error){
            setMessage("Failed to fetch Reslut. Please try again.");
        }
    };

    return (
        <div className="container">
            <h1>Add Review</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="hotelId">Hotel ID:</label>
                <input
                    type="text"
                    id="hotelId"
                    name="hotelId"
                    defaultValue={hotelId}
                    readOnly
                />
                <label htmlFor="rating">Rating:</label>
                <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="1"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                />
                <div className="hint">Rating must be between 1 and 5.</div>
                <label htmlFor="title">Review Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="text">Review Text:</label>
                <textarea
                    id="text"
                    name="text"
                    rows="10"
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
                <button type="submit">Submit Review</button>
            </form>
            {message && className="error">{message}</div>}
        </div>
    );
};

export default AddReview;

