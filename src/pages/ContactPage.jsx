import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Mail, MessageCircle, Send } from 'lucide-react';

    const contactMethods = [
      {
        name: 'WhatsApp',
        icon: <MessageCircle className="w-8 h-8 text-green-400" />,
        link: 'https://wa.me/233557488116',
        details: '+233 55 748 8116',
        actionText: 'Chat on WhatsApp',
        buttonClass: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
      },
      {
        name: 'Telegram',
        icon: <Send className="w-8 h-8 text-sky-400" />,
        link: 'https://t.me/HACKERPRO',
        details: '@HACKERPRO',
        actionText: 'Message on Telegram',
        buttonClass: 'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700',
      },
      {
        name: 'Email',
        icon: <Mail className="w-8 h-8 text-primary" />,
        link: 'mailto:support@hackerpro.com',
        details: 'support@hackerpro.com',
        actionText: 'Send an Email',
        buttonClass: 'bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90',
      },
    ];

    const ContactPage = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto py-12 px-4"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-gray-300 mb-12 text-center max-w-2xl mx-auto">
            Have questions, suggestions, or just want to say hi? Reach out to us through any of the channels below. We're always happy to hear from you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
                whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
              >
                <Card className="h-full flex flex-col glassmorphism bg-card border-border shadow-xl hover:shadow-primary/30 transition-shadow duration-300">
                  <CardHeader className="flex flex-col items-center text-center pt-8">
                    {method.icon}
                    <CardTitle className="mt-4 text-2xl font-semibold text-card-foreground">{method.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center text-center p-6">
                    <p className="text-muted-foreground mb-6 flex-grow">{method.details}</p>
                    <Button 
                      asChild 
                      className={`w-full ${method.buttonClass} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg`}
                    >
                      <a href={method.link} target="_blank" rel="noopener noreferrer">
                        {method.actionText}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    };

    export default ContactPage;