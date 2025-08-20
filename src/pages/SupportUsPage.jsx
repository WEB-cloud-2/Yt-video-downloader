import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Heart, Copy, DollarSign, Smartphone } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const supportOptions = [
      {
        name: 'MTN MOMO',
        icon: <Smartphone className="w-10 h-10 text-yellow-400" />,
        details: '0557488116',
        actionText: 'Copy Number',
        type: 'momo',
        buttonClass: 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700',
      },
      {
        name: 'TELECEL MOMO',
        icon: <Smartphone className="w-10 h-10 text-red-400" />,
        details: 'COMING SOON',
        actionText: 'Unavailable',
        type: 'momo_soon',
        disabled: true,
      },
      {
        name: 'Binance ID',
        icon: <DollarSign className="w-10 h-10 text-orange-400" />,
        details: '959055327',
        actionText: 'Copy ID',
        type: 'binance',
        buttonClass: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
      },
    ];

    const SupportUsPage = () => {
      const { toast } = useToast();

      const handleCopy = (textToCopy, itemName) => {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            toast({
              title: "Copied to Clipboard!",
              description: `${itemName}: ${textToCopy} copied.`,
              className: "bg-green-600 text-white"
            });
          })
          .catch(err => {
            toast({
              title: "Copy Failed",
              description: "Could not copy to clipboard. Please copy manually.",
              variant: "destructive",
            });
            console.error('Failed to copy: ', err);
          });
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto py-12 px-4"
        >
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Support <span className="gradient-text">Our Work</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              If you find our service useful, please consider supporting us. Your contributions help us maintain and improve this platform, keeping it free for everyone. Every little bit helps!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
                whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
              >
                <Card className={`h-full flex flex-col glassmorphism bg-card border-border shadow-xl hover:shadow-primary/30 transition-shadow duration-300 ${option.disabled ? 'opacity-60' : ''}`}>
                  <CardHeader className="flex flex-col items-center text-center pt-8">
                    {option.icon}
                    <CardTitle className="mt-4 text-2xl font-semibold text-card-foreground">{option.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center text-center p-6">
                    <p className="text-2xl font-mono text-gray-200 mb-6 flex-grow break-all">{option.details}</p>
                    {!option.disabled ? (
                      <Button 
                        onClick={() => handleCopy(option.details, option.name)}
                        className={`w-full ${option.buttonClass} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg`}
                      >
                        <Copy className="w-4 h-4 mr-2" /> {option.actionText}
                      </Button>
                    ) : (
                       <Button 
                        disabled
                        className="w-full bg-muted text-muted-foreground font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                      >
                        {option.actionText}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center p-8 glassmorphism rounded-xl shadow-2xl max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-3 alt-gradient-text">Thank You for Your Generosity!</h2>
            <p className="text-gray-300">
              Your support is invaluable and directly contributes to the development and upkeep of this free service. We appreciate every contribution, big or small.
            </p>
          </motion.div>
        </motion.div>
      );
    };

    export default SupportUsPage;