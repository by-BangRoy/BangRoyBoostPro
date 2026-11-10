import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-900 bg-slate-950 py-8">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">BangRoyBoost PRO</span>
          <span>·</span>
          <span>Platform Growth Suite untuk Seller Shopee Indonesia (SGW Gateway)</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Sinkronisasi Algoritma & Formula SEO E-Commerce</span>
          <span>·</span>
          <span>© {new Date().getFullYear()} BangRoyBoost</span>
        </div>
      </div>
    </footer>
  );
};
