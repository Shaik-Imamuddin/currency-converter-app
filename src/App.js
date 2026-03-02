import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getFlagUrl = (currency) => {
    if (!currency || currency.length < 2) return null;

    let countryCode = currency.substring(0, 2);

    if (currency === "EUR") countryCode = "EU";
    if (currency === "XAU") return null;
    if (currency === "XDR") return null;

    return `https://flagsapi.com/${countryCode}/flat/32.png`;
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          "https://open.er-api.com/v6/latest/USD"
        );
        const data = await response.json();

        if (data && data.rates) {
          setCurrencies(Object.keys(data.rates).sort());
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    setResult(null);
  }, [from, to, amount]);

  const convertCurrency = async () => {
    if (!amount || amount <= 0) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${from}`
      );

      const data = await response.json();

      if (data && data.rates && data.rates[to]) {
        const rate = data.rates[to];
        const convertedAmount = (Number(amount) * rate).toFixed(2);
        setResult(convertedAmount);
      }
    } catch (error) {
      console.error("Conversion error:", error);
    }

    setLoading(false);
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">💱 Currency Converter</h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="input"
        />

        <div className="select-row">
          <div className="currency-box">
            {getFlagUrl(from) && (
              <img
                src={getFlagUrl(from)}
                alt={from}
                className="flag"
              />
            )}
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {currencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>

          <button className="swap-btn" onClick={swapCurrencies}>
            ⇄
          </button>

          <div className="currency-box">
            {getFlagUrl(to) && (
              <img
                src={getFlagUrl(to)}
                alt={to}
                className="flag"
              />
            )}
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {currencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="button" onClick={convertCurrency}>
          Convert
        </button>

        {loading && <p className="loading">Fetching latest rate...</p>}

        {result !== null && (
          <div className="result">
            {amount} {from} = {result} {to}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;