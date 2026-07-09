import { useState, useEffect } from 'react';

const SalaryInfo = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalaryData();
  }, []);

  const fetchSalaryData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/salary-info');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setSalaryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading salary information...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="salary-info">
      <h2>Salary Information</h2>
      {salaryData.length === 0 ? (
        <p>No salary data available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((salary) => (
              <tr key={salary.id}>
                <td>{salary.employee_id}</td>
                <td>${salary.basic_salary?.toFixed(2) || '0.00'}</td>
                <td>${salary.allowances?.toFixed(2) || '0.00'}</td>
                <td>${salary.deductions?.toFixed(2) || '0.00'}</td>
                <td>${salary.net_salary?.toFixed(2) || '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalaryInfo;
