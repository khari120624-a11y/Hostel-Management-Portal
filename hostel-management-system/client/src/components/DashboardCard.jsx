import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, iconBg, iconColor, subtext, trend }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-md transition-all duration-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Rounded Icon Container */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg || 'bg-blue-50'}`}>
          {Icon && <Icon className={`w-7 h-7 ${iconColor || 'text-blue-600'}`} />}
        </div>

        {/* Content */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
      </div>

      {trend && (
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend.isPositive ? '+' : ''}{trend.value}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;

