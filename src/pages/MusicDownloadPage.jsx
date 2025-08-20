import React, { useState, useEffect } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { Download, Loader2, StickyNote as MusicNoteIcon, Info, Image as ImageIcon, ArrowLeft } from 'lucide-react';
    import { extractVideoIdFromUrl, initiateDownload } from '@/lib/downloadUtils';
    import DownloadPageLayout from '@/components/page/DownloadPageLayout';

    const MusicDownloadPage = () => {
      const { videoId: rawVideoId } = useParams();
      const [musicInfo, setMusicInfo] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const { toast } = useToast();
      const [isDownloading, setIsDownloading] = useState(false);

      const actualVideoId = extractVideoIdFromUrl(decodeURIComponent(rawVideoId));
      const youtubeUrlForApi = decodeURIComponent(rawVideoId).startsWith('http') 
                                ? decodeURIComponent(rawVideoId) 
                                : `https://www.youtube.com/watch?v=${actualVideoId}`;

      useEffect(() => {
        const fetchMusicInfo = async () => {
          setLoading(true);
          setError(null);
          setMusicInfo(null); 

          if (!actualVideoId && !decodeURIComponent(rawVideoId).startsWith('http')) {
            setError("Invalid link or Video ID. Please check the URL and try again.");
            setLoading(false);
            toast({
              title: "Invalid Link",
              description: "The provided link or Video ID is not valid.",
              variant: "destructive",
            });
            return;
          }

          try {
            const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(youtubeUrlForApi)}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
              let errorData;
              try {
                errorData = await response.json();
              } catch (e) {
                errorData = { message: `The download service returned an error (status: ${response.status}). It might be temporarily unavailable or the video cannot be processed for MP3.` };
              }
              console.error("API Error Data (Music):", errorData, "URL Sent:", youtubeUrlForApi);
              throw new Error(errorData.message || `API error: ${response.status}. The service might be temporarily unavailable or the video cannot be processed for MP3.`);
            }
            
            const data = await response.json();

            if (data.success && data.result && data.result.downloadUrl && data.result.title) {
              setMusicInfo(data.result);
              toast({
                title: "Music Details Loaded",
                description: `Ready to download: ${data.result.title}`,
                className: "bg-green-600 text-white"
              });
            } else {
              console.error("API Success False or No Result/Download URL/Title (Music):", data, "URL Sent:", youtubeUrlForApi);
              let errorMessage = "Failed to get music information. ";
              if (data.message) {
                errorMessage += data.message;
              } else if (!data.result || !data.result.downloadUrl) {
                errorMessage += "The download link is missing or the API could not process this video for MP3 conversion.";
              } else {
                errorMessage += "The API response was not as expected.";
              }
              throw new Error(errorMessage);
            }
          } catch (err) {
            console.error("Fetch music info error:", err, "URL Sent:", youtubeUrlForApi);
            const userFriendlyError = err.message || "Could not fetch music details. The video might be private, age-restricted, or unavailable for MP3 conversion. Please try another video or check the console for more details.";
            setError(userFriendlyError);
            toast({
              title: "Error Fetching Music",
              description: userFriendlyError,
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        };

        fetchMusicInfo();
      }, [rawVideoId, actualVideoId, youtubeUrlForApi, toast]);

      const handleDownloadClick = () => {
        initiateDownload(musicInfo, 'music', setIsDownloading, toast);
      };

      return (
        <DownloadPageLayout loading={loading} error={error} itemInfo={musicInfo} itemType="Music">
          {musicInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto py-8 px-4"
            >
              <Button asChild variant="outline" className="mb-6 border-primary text-primary hover:bg-primary/20 hover:text-primary/90">
                <Link to={-1}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
                </Link>
              </Button>

              <Card className="bg-card border-border shadow-xl glassmorphism">
                <CardHeader className="p-6">
                    {musicInfo.image ? (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{delay: 0.2}}>
                        <img 
                            alt={musicInfo.title || "Music artwork"}
                            className="w-full h-auto max-h-96 object-contain rounded-lg mb-4 shadow-lg"
                            src={musicInfo.image} />
                      </motion.div>
                    ) : (
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                        <MusicNoteIcon className="w-16 h-16 mx-auto text-primary mb-4" />
                      </motion.div>
                    )}
                  <CardTitle className="text-2xl md:text-3xl font-bold text-card-foreground text-center">
                    {musicInfo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6 space-y-3 bg-muted/30 p-4 rounded-lg">
                    <p className="text-lg text-foreground flex items-center">
                      <Info className="w-5 h-5 mr-2 text-primary" />
                      <span className="font-semibold text-primary">Quality:</span> <span className="ml-2">{musicInfo.quality || 'MP3 Audio'}</span>
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MusicNoteIcon className="w-5 h-5 mr-2 text-primary" />
                      <span className="font-semibold text-primary">Type:</span> <span className="ml-2">{musicInfo.type || 'Audio File'}</span>
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleDownloadClick} 
                    disabled={isDownloading || !musicInfo.downloadUrl}
                    className="w-full text-lg py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6 mr-2" /> Download Music ({musicInfo.quality || 'MP3'})
                      </>
                    )}
                  </Button>
                  {!musicInfo.downloadUrl && (
                    <p className="text-destructive text-sm mt-3 text-center">Download link unavailable. Please try another one.</p>
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

    export default MusicDownloadPage;