import { useState } from 'react';
import WorldMap from './components/WorldMap';
import axios from 'axios';

function App() {
  const [country, setCountry] = useState('');
  const [summary, setSummary] = useState('');

  const handleCountryClick = async (countryName) => {
    setCountry(countryName);
    setSummary('Loading...');

    try {
      const res = await axios.get(`http://localhost:8000/summary/${countryName}`);
      setSummary(res.data.summary);
    } catch (err) {
      setSummary('Failed to fetch summary.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Title */}
      <header className="p-4 bg-white shadow">
        <h1 className="text-3xl font-bold text-center">🌍 BrieflyGlobal</h1>
      </header>

      {/* Main Content: map + summary */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Map */}
        <section className="w-full md:w-2/3 min-h-[300px]">
          <WorldMap onCountryClick={handleCountryClick} />
        </section>

        {/* Summary panel */}
        <aside className="w-full md:w-1/3 bg-white p-4 md:min-h-full border-t md:border-t-0 md:border-l border-gray-300">
          <h2 className="text-xl font-semibold mb-2">
            {country ? `Top Story in ${country}` : 'Click a country to see news'}
          </h2>
          <p className="text-gray-700">{summary}</p>
        </aside>
      </main>
    </div>
  );
}

export default App;





