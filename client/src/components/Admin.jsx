import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FaUser, FaCode, FaBriefcase, FaProjectDiagram, FaEnvelope, 
  FaSignOutAlt, FaPlus, FaTrash, FaSave, FaTachometerAlt,
  FaEye, FaEyeSlash, FaTimes, FaCheckCircle
} from 'react-icons/fa';
import { fallbackPortfolioData } from '../portfolioData';
import './Admin.css';

export default function Admin({ onUpdate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contacts, setContacts] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('adminAuth') === 'true');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [msgToDelete, setMsgToDelete] = useState(null);

  // Fetch data
  const fetchData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        axios.get('/api/contact'),
        axios.get('/api/portfolio')
      ]);
      setContacts(cRes.data.data || []);
      if (pRes.data?.success && pRes.data?.data && Object.keys(pRes.data.data).length > 0) {
        setPortfolio(pRes.data.data);
      } else {
        console.warn("API returned empty portfolio, using fallback");
        setPortfolio(fallbackPortfolioData);
      }
    } catch (err) {
      toast.error('Failed to fetch data');
      console.error(err);
      setPortfolio(fallbackPortfolioData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Updated password as per user request: khushal@2002
    if (loginForm.username === 'khushal' && loginForm.password === 'khushal@2002') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setLoginError('');
      toast.success('Login Successful');
    } else {
      setLoginError('Invalid credentials. Access denied.');
      toast.error('Login Failed');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    toast.success('Logged Out');
  };

  const saveChanges = async () => {
    try {
      const res = await axios.put('/api/portfolio', portfolio);
      if (res.data.success) {
        toast.success(res.data.message);
        setPortfolio(res.data.data);
        if (onUpdate) onUpdate(); // Refresh global state
      }
    } catch (err) {
      toast.error('Error saving changes');
      console.error(err);
    }
  };

  const deleteMessage = async () => {
    if (!msgToDelete) return;
    try {
      const res = await axios.delete(`/api/contact/${msgToDelete._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setContacts(prev => prev.filter(c => c._id !== msgToDelete._id));
      }
    } catch (err) {
      toast.error('Failed to delete message');
    } finally {
      setMsgToDelete(null);
    }
  };

  const toggleRead = async (id) => {
    try {
      const res = await axios.patch(`/api/contact/${id}/toggle-read`);
      if (res.data.success) {
        setContacts(prev => prev.map(c => c._id === id ? res.data.data : c));
        // toast.success(res.data.data.read ? 'Marked as read' : 'Marked as unread');
      }
    } catch (err) {
      toast.error('Failed to update message status');
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) toggleRead(msg._id);
  };

  // Helper to update portfolio state fields
  const updateField = (field, value) => {
    setPortfolio(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setPortfolio(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  // Sections
  const renderDashboard = () => (
    <div className="admin-dashboard-stats">
      <div className="admin-card stats-card">
        <h3>Total Messages</h3>
        <p className="stats-number">{contacts.length}</p>
      </div>
      <div className="admin-card stats-card">
        <h3>Projects Live</h3>
        <p className="stats-number">{portfolio?.projects?.length || 0}</p>
      </div>
      <div className="admin-card stats-card">
        <h3>Skills Tracked</h3>
        <p className="stats-number">
          {Object.values(portfolio?.skills || {}).reduce((acc, curr) => acc + curr.length, 0)}
        </p>
      </div>
    </div>
  );

  const renderPortfolioInfo = () => (
    <div className="admin-card">
      <h3>
        General Information
        <button onClick={saveChanges} className="save-btn"><FaSave /> Save</button>
      </h3>
      <div className="input-group">
        <label>Full Name</label>
        <input type="text" value={portfolio?.name || ''} onChange={e => updateField('name', e.target.value)} />
      </div>
      <div className="input-group">
        <label>Job Title</label>
        <input type="text" value={portfolio?.title || ''} onChange={e => updateField('title', e.target.value)} />
      </div>
      <div className="input-group">
        <label>Summary</label>
        <textarea rows="4" value={portfolio?.summary || ''} onChange={e => updateField('summary', e.target.value)} />
      </div>
      <div className="dual-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="input-group">
          <label>Email</label>
          <input type="text" value={portfolio?.email || ''} onChange={e => updateField('email', e.target.value)} />
        </div>
        <div className="input-group">
          <label>Phone</label>
          <input type="text" value={portfolio?.phone || ''} onChange={e => updateField('phone', e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="admin-card">
      <h3>
        Skills &amp; Technologies
        <button onClick={saveChanges} className="save-btn"><FaSave /> Save</button>
      </h3>
      {Object.entries(portfolio?.skills || {}).map(([category, items]) => (
        <div key={category} className="input-group">
          <label style={{ textTransform: 'capitalize' }}>{category}</label>
          <input 
            type="text" 
            value={items.join(', ')} 
            onChange={e => updateNestedField('skills', category, e.target.value.split(',').map(s => s.trim()))} 
            placeholder="Comma separated values"
          />
        </div>
      ))}
    </div>
  );

  const renderArrayEditor = (title, key, fields) => (
    <div className="admin-card">
      <h3>
        {title}
        <button onClick={saveChanges} className="save-btn"><FaSave /> Save</button>
      </h3>
      {portfolio?.[key]?.map((item, index) => (
        <div key={index} className="array-item">
          <div className="array-item-header">
            <strong>Item #{index + 1}</strong>
            <button 
              className="remove-btn" 
              onClick={() => {
                const newList = [...portfolio[key]];
                newList.splice(index, 1);
                updateField(key, newList);
              }}
            >
              <FaTrash /> Remove
            </button>
          </div>
          <div className="array-item-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {fields.map(f => (
              <div key={f.name} className="input-group" style={{ gridColumn: f.fullWidth ? 'span 2' : 'auto' }}>
                <label>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea 
                    value={item[f.name] || ''} 
                    onChange={e => {
                      const newList = [...portfolio[key]];
                      newList[index][f.name] = e.target.value;
                      updateField(key, newList);
                    }}
                  />
                ) : (
                  <input 
                    type="text" 
                    value={item[f.name] || ''} 
                    onChange={e => {
                      const newList = [...portfolio[key]];
                      newList[index][f.name] = f.isArray ? e.target.value.split(',').map(s => s.trim()) : e.target.value;
                      updateField(key, newList);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button 
        className="add-btn" 
        onClick={() => {
          const newItem = fields.reduce((acc, f) => ({ ...acc, [f.name]: f.isArray ? [] : '' }), { id: Date.now() });
          updateField(key, [...portfolio[key], newItem]);
        }}
      >
        <FaPlus /> Add New {title.slice(0, -1)}
      </button>
    </div>
  );

  const renderContactsTab = () => (
    <div className="admin-card">
      <h3>Contact Submissions ({contacts.filter(c => !c.read).length} unread)</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No messages yet.</td></tr>
            ) : (
              contacts.map((c, i) => (
                <tr key={c._id || i} className={!c.read ? 'unread-row' : ''}>
                  <td>
                    {c.read ? (
                      <span className="status-pill read"><FaCheckCircle /> Read</span>
                    ) : (
                      <span className="status-pill unread">New</span>
                    )}
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>{c.name}</td>
                  <td title={c.email}>{c.email}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn view" title="View Message" onClick={() => openMessage(c)}>
                        <FaEye />
                      </button>
                      <button 
                        className={`icon-btn ${c.read ? 'unseen' : 'seen'}`} 
                        title={c.read ? "Mark as Unread" : "Mark as Read"}
                        onClick={() => toggleRead(c._id)}
                      >
                        {c.read ? <FaEyeSlash /> : <FaCheckCircle />}
                      </button>
                      <button className="icon-btn delete" title="Delete" onClick={() => setMsgToDelete(c)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <section id="admin" className="admin-section-wrapper login-screen">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>Admin Hub</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            {loginError && <p className="error-message">{loginError}</p>}
            <button type="submit" className="login-btn">Secure Login</button>
          </form>
        </motion.div>
      </section>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'profile', label: 'Profile Info', icon: <FaUser /> },
    { id: 'skills', label: 'Skills', icon: <FaCode /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase /> },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram /> },
    { id: 'contacts', label: 'Messages', icon: <FaEnvelope /> },
  ];

  return (
    <section className="admin-section-wrapper">
      <div className="admin-sidebar">
        <div className="sidebar-logo">AdminPanel</div>
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="nav-item logout-row" style={{ marginTop: 'auto', color: '#ff4757' }}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>

      <main className="admin-main">
        <div className="admin-header">
          <motion.h2 
            key={activeTab}
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            {tabs.find(t => t.id === activeTab)?.label}
          </motion.h2>
          <div className="last-updated">
            {portfolio?.updatedAt && <small>Last synced: {new Date(portfolio.updatedAt).toLocaleTimeString()}</small>}
          </div>
        </div>

        {loading ? <div className="loading-spinner">Loading dataset...</div> : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'profile' && renderPortfolioInfo()}
              {activeTab === 'skills' && renderSkills()}
              {activeTab === 'experience' && renderArrayEditor('Experience', 'experience', [
                { name: 'company', label: 'Company' },
                { name: 'role', label: 'Role' },
                { name: 'location', label: 'Location' },
                { name: 'duration', label: 'Duration' },
                { name: 'description', label: 'Description (comma separated)', type: 'textarea', fullWidth: true, isArray: true },
                { name: 'tech', label: 'Tech Stack (comma separated)', fullWidth: true, isArray: true },
              ])}
              {activeTab === 'projects' && renderArrayEditor('Projects', 'projects', [
                { name: 'title', label: 'Title' },
                { name: 'type', label: 'Type' },
                { name: 'icon', label: 'Icon (emoji)' },
                { name: 'tech', label: 'Tech Stack (comma separated)', isArray: true },
                { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
              ])}
              {activeTab === 'contacts' && renderContactsTab()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <AnimatePresence>
        {selectedMessage && (
          <motion.div 
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div 
              className="admin-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Message from {selectedMessage.name}</h3>
                <button className="close-btn" onClick={() => setSelectedMessage(null)}><FaTimes /></button>
              </div>
              <div className="modal-body">
                <div className="modal-info">
                  <p><strong>Email:</strong> {selectedMessage.email}</p>
                  <p><strong>Subject:</strong> {selectedMessage.subject || 'No Subject'}</p>
                  <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <div className="modal-message">
                  <strong>Content:</strong>
                  <p>{selectedMessage.message}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedMessage(null)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {msgToDelete && (
          <motion.div 
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMsgToDelete(null)}
          >
            <motion.div 
              className="admin-modal mini"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Delete Message?</h3>
                <button className="close-btn" onClick={() => setMsgToDelete(null)}><FaTimes /></button>
              </div>
              <div className="modal-body" style={{ textAlign: 'center', padding: '20px 30px' }}>
                <FaTrash style={{ fontSize: '2.5rem', color: '#ff4757', marginBottom: '15px' }} />
                <p>Are you sure you want to delete the message from <strong>{msgToDelete.name}</strong>?</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '5px' }}>This action cannot be undone.</p>
              </div>
              <div className="modal-footer" style={{ gap: '10px' }}>
                <button className="btn btn-secondary" onClick={() => setMsgToDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={deleteMessage}>Delete Permanently</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
