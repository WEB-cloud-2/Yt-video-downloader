import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Search, Video, Music, DownloadCloud } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';

    const HomePage = () => {
      const [searchTerm, setSearchTerm] = useState('');
      const navigate = useNavigate();
      const { toast } = useToast();

      useEffect(() => {
        const checkSupabaseConnection = async () => {
          try {
            const { data, error } = await supabase
              .from('health_check')
              .select('status')
              .limit(1);

            if (error) {
              console.error('Supabase connection error:', error);
            } else if (data && data.length > 0) {
              console.log('Successfully connected to Supabase and read from health_check table.');
            } else {
              console.warn('Supabase connected, but health_check table might be empty or inaccessible.');
            }
          } catch (e) {
            console.error('Supabase client initialization or critical error:', e);
          }
        };
        checkSupabaseConnection();
      }, []);

      const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
          toast({
            title: "Search Error",
            description: "Please enter a search term or YouTube URL.",
            variant: "destructive",
          });
          return;
        }
        navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 120 }}
            className="mb-8"
          >
            <DownloadCloud className="w-24 h-24 md:w-32 md:h-32 text-primary" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="gradient-text">All Music & Video</span> Downloader
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-4xl">
            Easily download your favorite music and videos from various sources. Paste a link or search by keyword.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-3xl flex flex-col sm:flex-row items-center gap-4 p-6 glassmorphism rounded-xl shadow-2xl">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search or paste URL (e.g., YouTube, etc.)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-lg bg-input border-border focus:ring-primary focus:border-primary rounded-lg placeholder-gray-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white font-semibold py-3 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </form>
          
          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <FeatureCard title="High Quality Videos" description="Download videos in various resolutions." icon={<Video className="w-8 h-8 text-secondary" />} />
            <FeatureCard title="Crystal Clear Music" description="Get your favorite tracks in high-quality MP3 format." icon={<Music className="w-8 h-8 text-primary" />} />
            <FeatureCard title="Fast & Easy" description="Quick search and one-click downloads for multiple platforms." icon={<Search className="w-8 h-8 text-orange-400" />} />
          </motion.div>
        </motion.div>
      );
    };

    const FeatureCard = ({ icon, title, description }) => (
      <motion.div 
        className="p-6 glassmorphism rounded-xl shadow-lg text-left"
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px hsla(var(--primary), 0.5)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center mb-3">
          {icon}
          <h3 className="ml-3 text-xl font-semibold text-gray-100">{title}</h3>
        </div>
        <p className="text-gray-300 text-sm">{description}</p>
      </motion.div>
    );

    export default HomePage;