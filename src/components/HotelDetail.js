import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './HotelDetail.css';

const HotelDetail = () => {
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/hotels/${hotelId}`);
                const data = await response.json();
                if (data.success) {
                    setHotel({
                        id: data.hotelId,
                        name: data.name,
                        address: data.address,
                        averageRating: data.averageRating,
                        expediaUrl: data.expediaUrl,
                    });
                    setReviews(data.reviews || []);
                    setIsFavorite(data.isFavorite || false);
                } else {
                    setError(data.message || 'Failed to fetch hotel details.');
                }
            } catch (err) {
                setError('Failed to fetch hotel details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchHotelDetails();
    }, [hotelId]);

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

    const handleExpediaClick = async () => {
        console.log("here");
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
                    <p className="hotel-address">{hotel.address}</p>
                    <p className="hotel-rating">Average Rating: {hotel.averageRating?.toFixed(1) || 'N/A'}</p>
                    <button className="favorite-icon" onClick={handleFavorite}>
                        {isFavorite ? '💖' : '🤍'}
                    </button>
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
                <h2>Reviews</h2>
                {currentReviews.length > 0 ? (
                    <ul className="reviews-list">
                        {currentReviews.map((review) => (
                            <li key={review.reviewId} className="review-item">
                                <h3 className="review-title">{review.title}</h3>
                                <p className="review-text">{review.text}</p>
                                <p className="review-info">
                                    <strong>{review.username}</strong> - {review.date} - Rating: {review.rating}
                                </p>
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
