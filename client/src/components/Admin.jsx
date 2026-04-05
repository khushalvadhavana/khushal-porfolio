import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Admin.css';

export default function Admin() {
  const [contacts, setContacts] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch contacts and portfolio data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          axios.get('/api/contact'),
          axios.get('/api/portfolio')
        ]);
        setContacts(cRes.data.data || []);
        setPortfolio(pRes.data.data);
      } catch (err) {
        console.error('Admin fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Simple render of contacts table
  const renderContacts = () => (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Subject</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((c, i) => (
          <tr key={i}>
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>{c.subject || '-'}</td>
            <td>{c.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Simple skill edit UI (placeholder)
  const renderSkillsEditor = () => (
    <div className="admin-section">
      <h3>Skills &amp; Technologies</h3>
      <pre>{JSON.stringify(portfolio?.skills, null, 2)}</pre>
      {/* In a real app you would add forms here to edit and PUT to /api/portfolioAdmin */}
    </div>
  );

  // Simple experience editor placeholder
  const renderExperienceEditor = () => (
    <div className="admin-section">
      <h3>Experience</h3>
      <pre>{JSON.stringify(portfolio?.experience, null, 2)}</pre>
    </div>
  );

  // Simple projects editor placeholder
  const renderProjectsEditor = () => (
    <div className="admin-section">
      <h3>Projects</h3>
      <pre>{JSON.stringify(portfolio?.projects, null, 2)}</pre>
    </div>
  );

  return (
    <section id="admin" className="admin-section-wrapper">
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        Admin Panel – Contact Submissions &amp; Portfolio Management
      </motion.h2>
      {loading ? <p>Loading...</p> : (
        <>
          <h4>Contact Form Submissions</h4>
          {renderContacts()}
          {renderSkillsEditor()}
          {renderExperienceEditor()}
          {renderProjectsEditor()}
        </>
      )}
    </section>
  );
}
