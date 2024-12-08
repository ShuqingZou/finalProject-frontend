import React, { useEffect} from "react";

const History = () => {
    const [history, setHistory] = React.useState(null);
    const [error, setError] = React.useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch("http://localhost:8080/history", {
                method: "GET",
                credentials: "include",
            });
            console.log(response.status);
            const result = await response.json();
            if (result.success) {
                setHistory(result.expediaClicks || []);
            } else {
                setError(result.message || "Failed to fetch history.");
            }
        }catch(error){
            setError("An error occurred.")
        }
    };

    const deleteClick = async(id) => {
        console.log("id = " + id);
        try{
            const response = await fetch(`http://localhost:8080/history?id=${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("success "+response.status);
            const result = await response.json();
            if (result.success) {
                console.log("success fetchhistory again");
                fetchHistory();
            }else{
                alert(result.message || "Failed to delete history.");
            }
        }catch(error){
            alert(error.message || "An error occurred while deleting the record.");
        }
    };

    if (error) {
        return (
            <div className="container">
                <p className="error">{error}</p>
            </div>
        );
    }

    if (!history) {
        return (
            <div className="container">
                <p>Loading history...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Expedia Click History (Last 7 Days)</h1>
            {history.length > 0 ? (
                <ul>
                    {history.map((click, index) => (
                        <li key={index}>
                            <a href={click.url} target="_blank" rel="noopener noreferrer">
                                {click.url}
                            </a>{" "}
                            - {new Date(click.timestamp).toLocaleString()}{" "}
                            <button onClick={() => deleteClick(click.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No Expedia clicks in the last 7 days.</p>
            )}
        </div>
    );
};

export default History;