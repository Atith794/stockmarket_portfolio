import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    NavLink,
} from "react-router-dom";
import "./App.css";

const Stocks = ({ addToWatchlist }) => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/stocks")
            .then((res) => res.json())
            .then((data) => setStocks(data))
            .catch((error) => console.error("Error fetching stocks:", error));
    }, []);

    const getRandomColor = () => {
        const colors = ["#FF0000", "#00FF00"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="App">
            <h1>Stock Market</h1>
            <h2>List of Stocks</h2>
            <ul>
                {stocks.map((stock) => (
                    <li key={stock.symbol}>
                        {stock.company} ({stock.symbol}) -
                        <span style={{ color: getRandomColor() }}>
                            {" "}
                            ${stock.initial_price}
                        </span>
                        <button onClick={() => addToWatchlist(stock)}>
                            Add to My WatchList
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Watchlist = ({ watchlist, removeFromWatchlist }) => {
    const getRandomColor = () => {
        const colors = ["#FF0000", "#00FF00"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="App">
            <h1>Stock Market</h1>
            <h2>My Watchlist</h2>
            <ul>
                {watchlist.map((stock) => (
                    <li key={stock.symbol}>
                        {stock.company} ({stock.symbol}) -
                        <span style={{ color: getRandomColor() }}>
                            {" "}
                            ${stock.initial_price}
                        </span>
                        <button onClick={() => removeFromWatchlist(stock.symbol)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

function App() {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/watchlist")
            .then((res) => res.json())
            .then((data) => setWatchlist(data))
            .catch((error) => console.error("Error fetching watchlist:", error));
    }, []);

    const addToWatchlist = (stock) => {
        fetch("http://localhost:5000/api/watchlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(stock),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                setWatchlist([...watchlist, stock]);
            })
            .catch((error) =>
                console.error("Error adding to watchlist:", error)
            );
    };

    const removeFromWatchlist = (symbol) => {
        fetch(`http://localhost:5000/api/watchlist/${symbol}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
            })
            .catch((error) =>
                console.error("Error removing from watchlist:", error)
            );
    };

    return (
        <Router>
            <nav>
                <NavLink to="/stocks">Stocks</NavLink>
                <NavLink to="/watchlist">Watchlist</NavLink>
            </nav>
            <Routes>
                <Route
                    path="/stocks"
                    element={<Stocks addToWatchlist={addToWatchlist} />}
                />
                <Route
                    path="/watchlist"
                    element={<Watchlist watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />}
                />
            </Routes>
        </Router>
    );
}

export default App;
