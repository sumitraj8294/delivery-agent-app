// src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [barcodeResult, setBarcodeResult] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/deliveries')
      .then(response => response.json())
      .then(data => setDeliveries(data))
      .catch(error => console.error("Error fetching deliveries:", error));
  }, []);

  useEffect(() => {
    // Initialize barcode scanner
    const Quagga = window.Quagga;
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#interactive'),
        constraints: {
          facingMode: "environment" // Use rear camera
        }
      },
      decoder: {
        readers: ["code_128_reader"]
      }
    }, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Barcode Scanner Initialized");
      Quagga.start();
    });

    Quagga.onDetected(function (data) {
      setBarcodeResult(data.codeResult.code);
      Quagga.stop(); // Stop scanning after detection
    });

  }, []);

  return (
    <div className="container">
      <h1 className="text-center mt-4">Assigned Deliveries</h1>
      <ul className="list-group mt-4">
        {deliveries.map((delivery, index) => (
          <li key={index} className="list-group-item">
            {delivery.item} to {delivery.address} (Status: {delivery.status})
          </li>
        ))}
      </ul>

      <div id="scanner-container">
        <h2>Scan a Barcode</h2>
        <div id="interactive" className="viewport"></div>
        <p id="result">Scanned Code: {barcodeResult}</p>
      </div>
    </div>
  );
}

export default App;
