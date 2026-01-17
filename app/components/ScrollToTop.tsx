"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 40 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[9999] p-4 rounded-full shadow-2xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--bg)",
            boxShadow: "0 8px 32px rgba(46, 196, 198, 0.4), 0 0 0 3px rgba(46, 196, 198, 0.2)",
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={28} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
