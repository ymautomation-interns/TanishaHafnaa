import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please choose an Excel file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setStatus('Uploading...');
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFileId(res.data.fileId);
      setStatus(`Uploaded: ${res.data.rowsInserted} rows saved to Postgres.`);
      await fetchData(res.data.fileId);
    } catch (err) {
      setStatus(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (id) => {
    const res = await axios.get(`${API_BASE}/data`, { params: { fileId: id } });
    setRows(res.data.rows);
  };

  const handleDownload = async (type) => {
    try {
      const res = await axios.get(`${API_BASE}/export/${type}`, {
        params: { fileId },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = type === 'excel' ? 'export.xlsx' : 'export.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setStatus(`Download failed: ${err.message}`);
    }
  };

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="app">
      <h1>Excel → PostgreSQL</h1>

      <div className="upload-section">
        <input type="file" accept=".xlsx,.xls" ref={fileInputRef} onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {status && <p className="status">{status}</p>}

      {rows.length > 0 && (
        <>
          <div className="download-section">
            <button onClick={() => handleDownload('excel')}>Download Excel</button>
            <button onClick={() => handleDownload('pdf')}>Download PDF</button>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map((h) => (
                      <td key={h}>{String(row[h] ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
