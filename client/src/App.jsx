import { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar';
import { Skeleton } from './components/Skeleton';
import { fallbackPortfolioData } from './portfolioData';

// Lazy load components for performance
const Admin = lazy(() => import('./components/Admin'));
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
import Chatbot from './components/Chatbot';

// Professional loading fallback for lazy-loaded sections
const SectionLoader = () => (
  <div className="container" style={{ padding: '100px 24px' }}>
    <Skeleton className="skeleton-title" />
    <Skeleton className="skeleton-text" />
    <Skeleton className="skeleton-text" style={{ width: '80%' }} />
    <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
      <Skeleton className="skeleton-card" style={{ flex: 1 }} />
      <Skeleton className="skeleton-card" style={{ flex: 1 }} />
    </div>
  </div>
);

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fade out the instant splash screen once React is ready
  useEffect(() => {
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
      // Small timeout to ensure the fade-out is visible and smooth
      const timeout = setTimeout(() => {
        document.body.classList.add('loader-loaded');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get('/api/portfolio');
      if (res.data?.success && res.data?.data && Object.keys(res.data.data).length > 0) {
        setPortfolio(res.data.data);
      } else {
        console.warn("API returned empty data, using fallback");
        setPortfolio(fallbackPortfolioData);
      }
    } catch (err) {
      console.error("Error fetching portfolio, using fallback", err);
      setPortfolio(fallbackPortfolioData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

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
        <Suspense fallback={<SectionLoader />}>
          <Routes>
            <Route path="/" element={
              <>
                <Hero data={portfolio} loading={loading} />
                <About data={portfolio} loading={loading} />
                <Skills data={portfolio?.skills} loading={loading} />
                <Experience data={portfolio?.experience} loading={loading} />
                <Projects data={portfolio?.projects} loading={loading} />
                <Contact />
              </>
            } />
            <Route path="/admin" element={<Admin onUpdate={fetchPortfolio} />} />
          </Routes>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer data={portfolio} />
      </Suspense>
      <Chatbot />
    </>
  )
}

export default App;
