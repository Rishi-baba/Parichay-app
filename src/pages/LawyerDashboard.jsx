import React, { useState } from 'react';
import { LayoutDashboard, FileText, CheckSquare, Clock } from 'lucide-react';
import '../styles/LawyerDashboard.css';

const cases = [
    { id: "CASE-2024-001", type: "Workplace Harassment", client: "Anonymous A.", status: "Review Needed", date: "Jan 04, 2024" },
    { id: "CASE-2024-002", type: "Rental Dispute", client: "Anonymous B.", status: "Drafting", date: "Jan 03, 2024" },
    { id: "CASE-2024-003", type: "Salary Due", client: "Anonymous C.", status: "New", date: "Jan 02, 2024" },
];

const LawyerDashboard = () => {
    const [selectedCase, setSelectedCase] = useState(null);

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h3>Lawyer Portal</h3>
                </div>
                <ul className="sidebar-menu">
                    <li className="active"><LayoutDashboard size={18} /> Dashboard</li>
                    <li><FileText size={18} /> My Cases</li>
                    <li><CheckSquare size={18} /> Document Reviews</li>
                </ul>
            </div>

            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h2>Welcome back, Advocate Verma</h2>
                    <span className="date-badge">{new Date().toDateString()}</span>
                </header>

                <div className="stats-row">
                    <div className="stat-card">
                        <h4>Pending Reviews</h4>
                        <p className="stat-num">5</p>
                    </div>
                    <div className="stat-card">
                        <h4>Active Cases</h4>
                        <p className="stat-num">12</p>
                    </div>
                    <div className="stat-card">
                        <h4>Pro-bono Hours</h4>
                        <p className="stat-num">24h</p>
                    </div>
                </div>

                <div className="cases-section">
                    <h3>Recent Cases</h3>
                    <div className="cases-table-wrapper">
                        <table className="cases-table">
                            <thead>
                                <tr>
                                    <th>Case ID</th>
                                    <th>Type</th>
                                    <th>Client</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cases.map((c) => (
                                    <tr key={c.id} onClick={() => setSelectedCase(c)} className={selectedCase?.id === c.id ? 'active-row' : ''}>
                                        <td>{c.id}</td>
                                        <td>{c.type}</td>
                                        <td>{c.client}</td>
                                        <td>{c.date}</td>
                                        <td><span className={`status-badge ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span></td>
                                        <td><button className="btn-sm">View</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedCase && (
                    <div className="case-detail-panel fade-in">
                        <h3>Detail: {selectedCase.id}</h3>
                        <p><strong>Issue Type:</strong> {selectedCase.type}</p>
                        <p><strong>Recommended Action:</strong> Prepare Legal Notice</p>
                        <div className="checklist">
                            <label><input type="checkbox" /> Review Client Statement</label>
                            <label><input type="checkbox" /> Verify Evidence</label>
                            <label><input type="checkbox" /> Draft Notice</label>
                        </div>
                        <button className="btn-primary" style={{ marginTop: '20px' }}>Prepare e-filing</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LawyerDashboard;
