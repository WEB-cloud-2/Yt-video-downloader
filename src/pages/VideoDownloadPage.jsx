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
