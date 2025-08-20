import React from 'react';
    import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import HomePage from '@/pages/HomePage';
    import SearchResultsPage from '@/pages/SearchResultsPage';
    import VideoDownloadPage from '@/pages/VideoDownloadPage';
    import MusicDownloadPage from '@/pages/MusicDownloadPage';
    import ContactPage from '@/pages/ContactPage';
    import SupportUsPage from '@/pages/SupportUsPage';
    import { Toaster } from '@/components/ui/toaster';
    import { Button } from '@/components/ui/button';
    import { Home, Search, Video, Music, Mail, Heart } from 'lucide-react';

    const navItems = [
      { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
      { path: '/contact', label: 'Contact', icon: <Mail className="w-5 h-5" /> },
      { path: '/support', label: 'Support Us', icon: <Heart className="w-5 h-5" /> },
    ];

    function Layout({ children }) {
      const location = useLocation();
      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-900 text-gray-100">
          <header className="py-3 px-4 sm:px-8 shadow-lg glassmorphism sticky top-0 z-50 border-b border-slate-700/50">
            <div className="w-full mx-auto flex justify-between items-center">
              <Link to="/" className="text-xl sm:text-2xl font-bold gradient-text">
                All Music and Video Downloader
              </Link>
              <nav className="hidden md:flex space-x-2">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? "secondary" : "ghost"}
                    asChild
                    className={`transition-all duration-300 ease-in-out transform hover:scale-105 ${location.pathname === item.path ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20 hover:text-primary'}`}
                  >
                    <Link to={item.path} className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
          </header>
          
          <main className="flex-grow w-full mx-auto px-4 sm:px-8 py-8">
            {children}
          </main>

          <footer className="py-6 text-center text-sm text-gray-400 border-t border-slate-700/50 glassmorphism">
            <p>&copy; {new Date().getFullYear()} All Music and Video Downloader. All rights reserved.</p>
            <p className="mt-1">Made by HACKERPRO</p>
          </footer>

          {/* Mobile Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-lg border-t border-slate-700 p-2 flex justify-around z-50">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  location.pathname === item.path ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-primary/80'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="md:hidden h-16"></div> {/* Spacer for mobile nav */}
        </div>
      );
    }

    function App() {
      return (
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/download/video/:videoId" element={<VideoDownloadPage />} />
              <Route path="/download/music/:videoId" element={<MusicDownloadPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/support" element={<SupportUsPage />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      );
    }

    export default App;