import React, { useState, useEffect } from 'react';
    import { useSearchParams, Link, useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { Music, Video, Loader2, AlertTriangle, Search as SearchIcon, ImageOff, ArrowLeft } from 'lucide-react';
    import { extractVideoIdFromUrl } from '@/lib/downloadUtils';


    const SearchResultsPage = () => {
      const [searchParams] = useSearchParams();
      const query = searchParams.get('query');
      const [results, setResults] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const { toast } = useToast();
      const navigate = useNavigate();

      useEffect(() => {
        if (!query) {
          setError("No search query provided. Please go back and enter a search term or URL.");
          setLoading(false);
          toast({
            title: "Missing Search Query",
            description: "Please enter a search term or URL on the home page.",
            variant: "destructive",
          });
          navigate("/"); 
          return;
        }

        const fetchResults = async () => {
          setLoading(true);
          setError(null);
          setResults([]);
          try {
            const isLikelyDirectLink = query.includes("http://") || query.includes("https://");
            
            if (isLikelyDirectLink) {
              const videoIdForThumbnail = (query.includes("youtube.com/") || query.includes("youtu.be/")) ? extractVideoIdFromUrl(query) : null;
              
              setResults([{
                videoId: query, 
                title: "Direct Link Detected",
                thumbnail: videoIdForThumbnail ? `https://img.youtube.com/vi/${videoIdForThumbnail}/hqdefault.jpg` : null,
                url: query, 
                isDirectLink: true,
                channel: "Direct Link",
                duration: "N/A",
                views: "N/A",
                published: "N/A"
              }]);
               toast({
                title: "Direct Link Found",
                description: "Processing your link directly. Choose video or music download.",
                className: "bg-secondary text-secondary-foreground"
              });
            } else {
              const response = await fetch(`https://apis.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent(query)}`);
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "The search service is currently unavailable or returned an error." }));
                throw new Error(errorData.message || `API search error: ${response.status}. Please try again later.`);
              }
              const data = await response.json();
              if (data.status && data.results && Array.isArray(data.results) && data.results.length > 0) {
                 setResults(data.results.slice(0, 12).map(item => ({...item, isDirectLink: false })));
                 toast({
                    title: "Search Successful!",
                    description: `Found ${data.results.length} results for "${query}".`,
                    className: "bg-green-600 text-white"
                  });
              } else if (data.success && data.result && Array.isArray(data.result) && data.result.length > 0) { 
                 setResults(data.result.slice(0, 12).map(item => ({...item, isDirectLink: false })));
                 toast({
                    title: "Search Successful!",
                    description: `Found ${data.result.length} results for "${query}".`,
                    className: "bg-green-600 text-white"
                  });
              }
              else {
                setResults([]);
                toast({
                  title: "No Results Found",
                  description: `We couldn't find any videos for "${query}". Try different keywords or check for typos.`,
                  variant: "default",
                });
              }
            }
          } catch (err) {
            console.error("Search error:", err);
            const userFriendlyError = err.message || "Failed to fetch search results. There might be a temporary issue with the search service. Please try again in a few moments.";
            setError(userFriendlyError);
            toast({
              title: "Search Failed",
              description: userFriendlyError,
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        };

        fetchResults();
      }, [query, toast, navigate]);


      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-xl text-gray-300">Searching for "{query}"...</p>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-semibold text-destructive mb-2">Oops! Search Error</h2>
            <p className="text-gray-300 max-w-lg">{error}</p>
            <Button onClick={() => navigate("/")} className="mt-6 bg-primary hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" /> Try Another Search
            </Button>
          </div>
        );
      }
      
      if (results.length === 0 && !loading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">No Results Found</h2>
            <p className="text-muted-foreground max-w-lg">We couldn't find any results for "{query}". Please try different keywords, check for typos, or try a direct URL.</p>
            <Button onClick={() => navigate("/")} className="mt-6 bg-primary hover:bg-primary/90">
             <ArrowLeft className="w-4 h-4 mr-2" />  Back to Home
            </Button>
          </div>
        );
      }


      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="py-8" 
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
            {results.length === 1 && results[0].isDirectLink ? <span className="alt-gradient-text">Direct Link Ready</span> : <span className="gradient-text">Search Results</span>}
          </h1>
           <p className="text-center text-muted-foreground mb-8 text-lg max-w-4xl mx-auto break-all">
            {results.length === 1 && results[0].isDirectLink ? `Processing: ${results[0].url}` : `Showing results for: "${query}"`}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((item, index) => (
              <motion.div
                key={item.videoId || item.id || index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-card border-border shadow-xl hover:shadow-primary/30 transition-shadow duration-300 flex flex-col h-full glassmorphism overflow-hidden">
                  <CardHeader className="p-0 relative">
                    {item.thumbnail ? (
                      <img 
                        alt={item.title || "Search result thumbnail"}
                        className="w-full h-48 object-cover"
                        src={item.thumbnail} 
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : (
                       <div className="w-full h-48 bg-slate-700 flex items-center justify-center">
                        <ImageOff className="w-16 h-16 text-slate-500" />
                       </div>
                    )}
                    <div className={`w-full h-48 bg-slate-700 items-center justify-center hidden`}>
                        <ImageOff className="w-16 h-16 text-slate-500" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-card-foreground mb-2 h-14 overflow-hidden hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      {!item.isDirectLink && (
                        <>
                          {item.channel && <p className="text-xs text-muted-foreground mb-1 truncate">Channel: {item.channel}</p>}
                          <div className="flex justify-between text-xs text-muted-foreground/80">
                            {item.duration && <span>{item.duration}</span>}
                            {item.views && <span>{Number(item.views).toLocaleString()} views</span>}
                          </div>
                          {item.published && <p className="text-xs text-muted-foreground/80 mt-1">{item.published}</p>}
                        </>
                      )}
                       {item.isDirectLink && <p className="text-sm text-muted-foreground">Click below to choose download format.</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t border-border/50 flex flex-col sm:flex-row sm:justify-between gap-2">
                    <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white transition-all duration-300 transform hover:scale-105 flex-1">
                      <Link to={`/download/video/${encodeURIComponent(item.videoId)}`}>
                        <Video className="w-4 h-4 mr-2" /> Video
                      </Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white transition-all duration-300 transform hover:scale-105 flex-1">
                      <Link to={`/download/music/${encodeURIComponent(item.videoId)}`}>
                        <Music className="w-4 h-4 mr-2" /> Music
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    };

    export default SearchResultsPage;