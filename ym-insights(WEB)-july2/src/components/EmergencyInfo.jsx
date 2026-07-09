import { useState, useEffect } from 'react';

const EmergencyInfo = () => {
  const [emergencyData, setEmergencyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  const fetchEmergencyData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/emergency-info');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setEmergencyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading emergency information...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="emergency-info">
      <h2>Emergency Information</h2>
      {emergencyData.length === 0 ? (
        <p>No emergency data available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Contact Name</th>
              <th>Relationship</th>
              <th>Phone Number</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {emergencyData.map((emergency) => (
              <tr key={emergency.id}>
                <td>{emergency.employee_id}</td>
                <td>{emergency.contact_name}</td>
                <td>{emergency.relationship}</td>
                <td>{emergency.phone_number}</td>
                <td>{emergency.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmergencyInfo;
