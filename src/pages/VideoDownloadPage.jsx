import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2, AlertTriangle, ArrowLeft, Film as FilmIcon, Info } from 'lucide-react';
import { extractVideoIdFromUrl, initiateDownload } from '@/lib/downloadUtils';
import DownloadPageLayout from '@/components/page/DownloadPageLayout';

const VideoDownloadPage = () => {
  const { videoId: rawVideoId } = useParams();
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const actualVideoId = extractVideoIdFromUrl(decodeURIComponent(rawVideoId));
  const youtubeUrlForApi = decodeURIComponent(rawVideoId).startsWith('http') 
                            ? decodeURIComponent(rawVideoId) 
                            : `https://www.youtube.com/watch?v=${actualVideoId}`;

  useEffect(() => {
    const fetchVideoInfo = async () => {
      setLoading(true);
      setError(null);
      setVideoInfo(null);

      if (!actualVideoId && !decodeURIComponent(rawVideoId).startsWith('http')) {
        setError("Invalid YouTube link or Video ID. Please check the URL and try again.");
        setLoading(false);
        toast({
          title: "Invalid Link",
          description: "The provided YouTube link or Video ID is not valid.",
          variant: "destructive",
        });
        return;
      }

      try {
        // Updated API endpoint with GiftedTech API
        const apiUrl = `https://api.giftedtech.co.ke/api/download/ytmp4?apikey=gifted&url=${encodeURIComponent(youtubeUrlForApi)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch(e) {
            errorData = { message: `The download service returned an error (status: ${response.status}). It might be temporarily unavailable or the video cannot be processed.` };
          }
          console.error("API Error Data (Video):", errorData, "URL Sent:", youtubeUrlForApi);
          throw new Error(errorData.message || `API error: ${response.status}. The service might be temporarily unavailable or the video cannot be processed.`);
        }

        const data = await response.json();

        // Updated response handling for the GiftedTech API structure
        if (data.success && data.result && data.result.download_url) {
          // Map the API response to the expected format
          const formattedVideoInfo = {
            title: data.result.title,
            thumbnail: data.result.thumbnail,
            download_url: data.result.download_url,
            quality: data.result.quality || 'HD',
            type: 'Video File'
          };
          
          setVideoInfo(formattedVideoInfo);
          toast({
            title: "Video Details Loaded",
            description: `Ready to download: ${data.result.title}`,
            className: "bg-green-600 text-white"
          });
        } else {
          console.error("API Success False or No Result/Download URL (Video):", data, "URL Sent:", youtubeUrlForApi);
          let errorMessage = "Failed to get video information. ";
          if(data.message) {
            errorMessage += data.message;
          } else if (!data.result || !data.result.download_url) {
            errorMessage += "The download link is missing or the API could not process this video.";
          } else {
            errorMessage += "The API response was not as expected.";
          }
          throw new Error(errorMessage);
        }
      } catch (err) {
        console.error("Fetch video info error:", err, "URL Sent:", youtubeUrlForApi);
        const userFriendlyError = err.message || "Could not fetch video details. The video might be private, age-restricted, or unavailable. Please try another video or check the console for more details.";
        setError(userFriendlyError);
        toast({
          title: "Error Fetching Video",
          description: userFriendlyError,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideoInfo();
  }, [rawVideoId, actualVideoId, youtubeUrlForApi, toast]);

  const handleDownloadClick = () => {
    initiateDownload(videoInfo, 'video', setIsDownloading, toast);
  };
  
  return (
    <DownloadPageLayout loading={loading} error={error} itemInfo={videoInfo} itemType="Video">
      {videoInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto py-8 px-4"
        >
          <Button asChild variant="outline" className="mb-6 border-secondary text-secondary hover:bg-secondary/20 hover:text-secondary/90">
            <Link to={-1}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
            </Link>
          </Button>

          <Card className="bg-card border-border shadow-xl glassmorphism">
            <CardHeader className="p-6">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                <FilmIcon className="w-16 h-16 mx-auto text-secondary mb-4" />
              </motion.div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-card-foreground text-center">
                {videoInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 space-y-3 bg-muted/30 p-4 rounded-lg">
                <p className="text-lg text-foreground flex items-center">
                  <Info className="w-5 h-5 mr-2 text-secondary" />
                  <span className="font-semibold text-secondary">Quality:</span> <span className="ml-2">{videoInfo.quality || 'Standard Definition'}</span>
                </p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <FilmIcon className="w-5 h-5 mr-2 text-secondary" />
                  <span className="font-semibold text-secondary">Type:</span> <span className="ml-2">{videoInfo.type || 'Video File'}</span>
                </p>
              </div>
              
              <Button 
                onClick={handleDownloadClick} 
                disabled={isDownloading || !videoInfo.download_url}
                className="w-full text-lg py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6 mr-2" /> Download Video ({videoInfo.quality || 'MP4'})
                  </>
                )}
              </Button>
              {!videoInfo.download_url && (
                <p className="text-destructive text-sm mt-3 text-center">Download link unavailable. Please try another video.</p>
              )}
              <p className="text-xs text-muted-foreground mt-4 text-center">
                If download doesn't start, check pop-up blockers or download settings.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </DownloadPageLayout>
  );
};

export default VideoDownloadPage;
