import { toast as showToast } from '@/components/ui/use-toast';

    export const extractVideoIdFromUrl = (url) => {
      let videoId = url;
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }
      else if (!url.includes("/") && !url.includes("?")) { 
        return url;
      }
      else { 
          const match = url.match(/[?&]v=([^&]+)/);
          if (match) return match[1];
          const shortMatch = url.match(/youtu\.be\/([^?]+)/);
          if (shortMatch) return shortMatch[1];
      }
      return videoId; 
    };

    export const initiateDownload = async (itemInfo, itemType, setIsDownloading, toastFn) => {
      const downloadUrl = itemType === 'music' ? itemInfo?.downloadUrl : itemInfo?.download_url;
      const fileExtension = itemType === 'music' ? 'mp3' : 'mp4';

      if (!itemInfo || !downloadUrl) {
        toastFn({
          title: "Download Error",
          description: `No download link available for this ${itemType}. Please try again later or select a different item.`,
          variant: "destructive",
        });
        return;
      }

      setIsDownloading(true);
      toastFn({
        title: "Preparing Download",
        description: `Preparing to download "${itemInfo.title}"... This may take a moment.`,
        className: "bg-blue-600 text-white"
      });

      try {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${itemInfo.title.replace(/[^\w\s.-]/gi, '')}.${fileExtension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          toastFn({
            title: "Download Started!",
            description: `"${itemInfo.title}" download should begin shortly. Please check your browser's download manager.`,
            className: "bg-green-600 text-white"
          });
          setIsDownloading(false);
        }, 3000);

      } catch (err) {
        console.error("Download error:", err);
        toastFn({
          title: "Download Failed",
          description: `An error occurred while trying to initiate the ${itemType} download. The download link might be invalid, expired, or your browser might have blocked it. Please try again.`,
          variant: "destructive",
        });
        setIsDownloading(false);
      }
    };