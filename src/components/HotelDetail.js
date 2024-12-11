import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import './HotelDetail.css';

const HotelDetail = () => {
    const { hotelId } = useParams();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [weather, setWeather] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewCount, setReviewCount] = useState(0);
    const [comments, setComments] = useState({});
    const [averageRating, setAverageRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchHotelInfo();
        fetchHotelReviews();
    }, [hotelId]);

    const fetchHotelInfo = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/hotels/${hotelId}?type=info`);
            const data = await response.json();
            if (data.success) {
                setHotel({
                    id: data.hotelId,
                    name: data.name,
                    address: data.address,
                    averageRating: 0,
                    expediaUrl: data.expediaUrl,
                });
                setIsFavorite(data.isFavorite || false);
                setWeather(data.weather || null);
            } else {
                setError(data.message || 'Failed to fetch hotel details.');
            }
        } catch (err) {
            setError('Failed to fetch hotel details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchHotelReviews = async () => {
        try{
            const response = await fetch(`/hotels/${hotelId}?type=reviews`);
            const data = await response.json();
            if (data.success) {
                setReviews(data.reviews || []);
                setAverageRating(data.averageRating);
                setReviewCount(data.reviews ? data.reviews.length : 0);
            } else {
                setError(data.message || 'Failed to fetch reviews.');
            }
        } catch (err) {
            setError('Failed to fetch reviews. Please try again.');
        }
    };

    const handleFavorite = async () => {
        try{
            const response = await fetch(`http://localhost:8080/hotels/${hotelId}`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    hotelId: hotelId,
                    hotelName: hotel.name,
                    isFavorite: !isFavorite,
                }),
            });
            const result = await response.json();
            if (result.success) {
                setIsFavorite(!isFavorite);
            }else{
                console.error('Failed to update favorite details. Please try again.');
            }
        }catch(error){
            console.error('Error updating favorite status: ', error);
        }
    };

    const fetchComments = async (reviewId) => {
        try{
            const response = await fetch(`http://localhost:8080/hotels/reviews/${reviewId}/comments`);
            const data = await response.json();
            if (data.success) {
                setComments((prevComments) =>({
                    ...prevComments,
                    [reviewId]: data.comments,
                }));
            }else{
                console.error('Failed to fetch comments. Please try again.');
            }
        }catch(error){
            console.error('Error updating comments. Please try again.');
        }
    };

    const addComment = async (reviewId, commentText) => {
        try{
            console.log(reviewId);
            console.log(commentText);
            const response = await fetch(`http://localhost:8080/hotels/reviews/${reviewId}/comments`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text: commentText}),
            });
            console.log(response);
            const data = await response.json();
            if (data.success) {
                fetchHotelReviews();
            }else {
                console.error('Failed to add comments. Please try again.');
            }
        }catch(error){
            console.error('Error updating comments. Please try again.');
        }
    };

    const renderComments = (comments) => {
        return comments?.map((comment, idx) => (
            <p key={idx} className="comment-item">
                <strong>{comment.username}: </strong>{comment.text}
            </p>
        ));
    };

    const handleExpediaClick = async () => {
        try{
            const response = await fetch(`http://localhost:8080/hotels/${hotelId}`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    expediaUrl: hotel.expediaUrl,
                    timestamp: new Date().toISOString()
                }),
            });
            if (!response.ok) {
                console.error('Failed to log Expedia Click: HTTP status', response.status);
                return;
            }

            const result = await response.json();
            if (result.success) {
                console.log('Expedia Click logged successfully');
            } else {
                console.error('Failed to log Expedia Click:', result.message || 'Unknown error');
            }
        } catch(error){
            console.error('Error logging Expedia Click: ', error);
        }
    };

    const editRev = (item) => {
        navigate("/ModifyReview", {
            state: { revContant: item, hotelId: hotelId },
        });
    };

    const delRev = async (item) => {
        const params = new URLSearchParams({
            reviewId: item.reviewId,
        });
        setMessage("");
        try {
            const response = await fetch(`/deleteReview?${params}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            if (result.success) {
                fetchHotelReviews();
            } else {
                setMessage(result.message || "An error occurred.");
            }
        } catch (error) {
            setMessage("Failed to fetch results. Please try again.");
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="star full">★</span>);
        }
        if (halfStars > 0) {
            stars.push(<span key="half" className="star half">☆</span>);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
        }
        return stars;
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < Math.ceil(reviews.length / reviewsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading) return <div className="loading">Loading hotel details...</div>;

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container">
            {hotel && (
                <div className="hotel-info">
                    <h1 className="hotel-name">{hotel.name}</h1>
                    <p className="hotel-address">{hotel.address}
                        {weather && (
                            <span className="weather-info">
                                <span className="weather-item">
                                    <span className="weather-icon" role="img" aria-label="temperature">🌡</span>
                                    {weather.temperature}
                                </span>
                                <span className="weather-item">
                                    <span className="weather-icon" role="img" aria-label="windspeed">💨</span>
                                    {weather.windspeed}
                                </span>
                            </span>
                        )}
                    </p>
                    <p className="hotel-rating">Average Rating: {averageRating.toFixed(1) || 'N/A'}
                        <span className="stars">{renderStars(averageRating)}</span>
                    </p>
                    <span className="favorite-icon"
                          onClick={handleFavorite}
                    >
                        {isFavorite ? '💖' : '🤍'}
                    </span>
                    <a
                        href={hotel.expediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="expedia-link"
                        onClick={handleExpediaClick}
                    >
                        View on Expedia
                    </a>
                </div>
            )}
            <div className="reviews-section">
                <h2>Reviews {reviewCount > 0 && `(${reviewCount})`}</h2>
                <Link to={`/addReview/${hotelId}`} className="hotel-link">
                    <button>Add Review</button>
                </Link>
                {currentReviews.length > 0 ? (
                    <ul className="reviews-list">
                        {currentReviews.map((review) => (
                            <li key={review.reviewId} className="review-item">
                                {review.ownerFlag && (
                                    <div style={{float: "right", display: "flex", gap:"15px"}}>
                                        <span
                                            className="edit-icon"
                                            onClick={() => editRev(review)}
                                        >
                                            📝
                                        </span>
                                        <span
                                            className="delete-icon"
                                            onClick={() => delRev(review)}
                                        >
                                            ❌
                                        </span>
                                    </div>
                                )}
                                <p className="review-title">
                                    Title:
                                    <span style={{fontWeight: "normal"}}>{review.title}</span>
                                </p>
                                <p className="review-title">
                                    Text:
                                    <span style={{fontWeight: "normal"}}>{review.text}</span>
                                </p>
                                <p className="review-info" style={{height: "30px"}}>
                                    <strong>{review.username}</strong> - {review.date} - Rating:{" "}
                                    {review.rating}
                                </p>
                                {!review.owerFlag && (
                                    <span
                                        className="add-comment-btn"
                                        onClick={() => {
                                            const comment = prompt('Enter your comment:');
                                            if (comment) addComment(review.reviewId, comment);
                                        }}
                                    >
                                        ➕
                                    </span>
                                )}
                                <div className="comments-section">
                                    <h4>Comments</h4>
                                    {review.comments && review.comments.length > 0 ? (
                                        renderComments(review.comments)
                                    ) : (
                                        <p className="no-comments">No comments yet.</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-reviews">No reviews available for this hotel.</p>
                )}
                <div className="pagination">
                    <button onClick={handlePrevious} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>{currentPage}</span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelDetail;
