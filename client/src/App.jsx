import { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar';
import Admin from './components/Admin';
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get('/api/portfolio');
      setPortfolio(res.data.data);
    } catch (err) {
      console.error("Error fetching portfolio", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading) return <div className="loading-screen">Loading Portfolio...</div>;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d0d1f',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Navbar data={portfolio} />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero data={portfolio} />
              <About data={portfolio} />
              <Skills data={portfolio?.skills} />
              <Experience data={portfolio?.experience} />
              <Projects data={portfolio?.projects} />
              <Contact />
            </>
          } />
          <Route path="/admin" element={<Admin onUpdate={fetchPortfolio} />} />
        </Routes>
      </main>
      <Footer data={portfolio} />
    </>
  )
}

export default App
