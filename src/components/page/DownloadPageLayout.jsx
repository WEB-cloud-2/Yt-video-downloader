import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';

    const DownloadPageLayout = ({ loading, error, itemInfo, itemType, children }) => {
      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-xl text-gray-300">Fetching {itemType} Details...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait a moment.</p>
          </div>
        );
      }

      if (error || !itemInfo) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-semibold text-destructive mb-2">{itemType} Currently Unavailable</h2>
            <p className="text-gray-300 max-w-lg mb-4">
              {error || `The ${itemType.toLowerCase()} details could not be loaded. This might be due to a temporary issue with the download service, or the specific ${itemType.toLowerCase()} might not be available for download.`}
            </p>
            <p className="text-sm text-muted-foreground">Please try a different {itemType.toLowerCase()} or check back later.</p>
            <Button asChild className="mt-6 bg-primary hover:bg-primary/90">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Back Home
              </Link>
            </Button>
          </div>
        );
      }

      return <>{children}</>;
    };

    export default DownloadPageLayout;