import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ModifyReview.css";

const ModifyReview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [rating, setRating] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [reviewId, setReviewId] = useState("");
    const [hotelId, sethotelId] = useState("");
    const [message, setMessage] = useState("");
    const dataFetchedRef = useRef(false);

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        const detailQuery = location.state?.revContent;
        const hotelId = location.state?.hotelId;
        sethotelId(hotelId);
        setRating(detailQuery?.rating || "");
        setTitle(detailQuery?.title || "");
        setText(detailQuery?.text || "");
        setReviewId(detailQuery?.reviewId || "");
    }, [location]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        const params = new URLSearchParams({
            reviewId: reviewId,
            rating: rating,
            title: title,
            text: text,
        });
        try {
            const response = await fetch(`/modifyReview?${params}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();

            if (result.success) {
                navigate(`/hotels/${hotelId}`);
            } else {
                setMessage(result.message || "An error occurred.");
            }
        } catch (error) {
            setMessage("Failed to fetch results. Please try again.");
        }
    };

    return(
        <div className="container">
            <h1>Modify Review</h1>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="reviewId" value={reviewId} />
                <label htmlFor="rating">Rating</label>
                <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={rating}
                    onChange={(e) => setrating(e.target.value)}
                    required
                />
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label htmlFor="text">Review Text:</label>
                <textarea
                    id="text"
                    name="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Confirm</button>
                {message && <p className="error">{message}</p>}
            </form>
        </div>
    );
);

export default ModifyReview;