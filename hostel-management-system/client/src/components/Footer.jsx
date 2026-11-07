import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 px-6 border-t border-slate-200/60 bg-white/50 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
      <p>© {new Date().getFullYear()} Hostel Management System (HMS) • All rights reserved.</p>
      <div className="flex items-center gap-4 text-slate-400">
        <span>MERN Stack Capstone</span>
        <span>•</span>
        <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Online
        </span>
      </div>
    </footer>
  );
};

export default Footer;

