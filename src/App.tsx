import React, { useState } from "react";
import HotelResults from "./components/hotel-results/hotel-results";
import "./App.css";
import { Hotel } from "./types/hotel.types";
import NavBar from "./components/navbar/nav-bar";

const App: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <div className="app">
      <main className="app-main">
        <NavBar
          setHotels={setHotels}
          setError={setError}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
        <HotelResults hotels={hotels} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
};

export default App;
