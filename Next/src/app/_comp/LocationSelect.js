'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useLocation } from '../_context/LocationContext';
import { useRouter } from 'next/navigation';

export default function LocationSelect({ onLocationSelect }) {
  const [branches, setBranches] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(false);

  const { setLocation } = useLocation();
  const router = useRouter();

  // ✅ Fetch branches
  useEffect(() => {
    api.get('/getallbrancheslist')
      .then((res) => {
        const data = res.data.branches || [];
        setBranches(data);

        const cityNames = [...new Set(
          data.map((b) =>
            b.BranchName.includes('-') ? b.BranchName.split('-')[0].trim() : ''
          )
        )].filter(Boolean);

        setCities(cityNames);
      })
      .catch((err) => console.error('Failed to fetch branches:', err));
  }, []);

  // ✅ When city changes
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    setSelectedArea('');

    const branchWithAreas = branches.find(
      (b) => b.BranchName.startsWith(cityName) && b.city?.areas?.length > 0
    );

    if (branchWithAreas?.city?.areas) {
      setAreas(branchWithAreas.city.areas);
    } else {
      setAreas([]);
    }
  };

  // ✅ Submit location
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedBranch = branches.find((b) =>
        b.BranchName.startsWith(selectedCity)
      );
      const branchId = selectedBranch?.BranchID || null;

      // 🔑 Get selected area object
      const selectedAreaObj = areas.find((a) => a.AreaName === selectedArea);

      const selectedLocation = {
        city: selectedCity,
        area: selectedArea,
        areaId: selectedAreaObj?.AreaID || null,  // ✅ Store AreaID
        branchId: branchId,
        branchName: selectedBranch?.BranchName || ''
      };

      setLocation(selectedLocation);
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));

      if (onLocationSelect) {
        onLocationSelect(selectedLocation);
      } else {
        router.push('/');
      }

    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="city" className="form-label">City</label>
        <select
          className="form-select"
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          required
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {areas.length > 0 && (
        <div className="mb-3">
          <label htmlFor="area" className="form-label">Area</label>
          <select
            className="form-select"
            id="area"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            required
          >
            <option value="">Select an area</option>
            {areas.map((area) => (
              <option key={area.AreaID} value={area.AreaName}>
                {area.AreaName}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-success w-100" disabled={loading}>
        {loading ? 'Loading...' : 'Select & Continue'}
      </button>
    </form>
  );
}
