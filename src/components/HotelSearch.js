import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./HotelSearch.css";

const HotelSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setResults([]);

        try {
            const response = await fetch('http://localhost:8080/hotels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ search: searchTerm }),
            });

            const result = await response.json();

            if (result.success) {
                setResults(result.hotels);
            } else {
                setMessage(result.message || 'An error occurred.');
            }
        } catch (error) {
            setMessage('Failed to fetch results. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="jumbotron">
                <h1>Hotel Search</h1>
                <p className="description">Find the best hotels for your next adventure!</p>
            </div>
            <form onSubmit={handleSearchSubmit} className="search-form">
                <div className="form-group">
                    <label htmlFor="search">Search:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Enter hotel ID or keyword"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            {message && <p className="error-message">{message}</p>}
            <div className="results-container">
                {results.map((hotel) => (
                    <div className="hotel-item" key={hotel.hotelId}>
                        <Link to={`/hotels/${hotel.hotelId}`} className="hotel-link">
                            <h3 className="hotel-name">{hotel.name}</h3>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default HotelSearch;
