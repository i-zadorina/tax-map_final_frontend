import React, { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { exchangeRatesApi } from "../../utils/api";
import { Profile, TaxSummary } from "../../utils/taxStrategies";
import WorldMap from "../WorldMap/WorldMap";

const MapPage: React.FC = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    exchangeRatesApi()
      .then((data) => {
        setExchangeRates(data.rates);
      })
      .catch((err) => console.error("Error fetching exchange rates:", err));
  }, []);

  const profile: Profile = {
    incomeUSD: Number(currentUser.income) || 0,
    status: currentUser.status as "single" | "married",
  };

  return (
    <section className="map-page">
      <WorldMap profile={profile} exchangeRates={exchangeRates} />
    </section>
  );
};

export default MapPage;
