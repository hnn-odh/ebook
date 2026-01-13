import React from 'react';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    return (
        <header className="z-30 bg-white border-b border-slate-200 shadow-sm shrink-0 h-16 sm:h-20">
            <div className="flex items-center justify-between p-3 sm:p-4 gap-4 h-full">
                {/* Menu Button */}
                <button 
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-dge-tech-blue"
                >
                    <span className="material-symbols-outlined text-2xl">menu</span>
                </button>

                {/* Search Bar - Hidden on very small mobile screens */}
                <div className="flex-1 max-w-md hidden sm:block">
                    <label className="relative flex items-center group">
                        <span className="material-symbols-outlined absolute right-3 text-slate-400 group-focus-within:text-dge-tech-blue transition-colors">search</span>
                        <input 
                            className="w-full h-10 pr-10 pl-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dge-tech-blue/50 focus:border-dge-tech-blue transition-all placeholder:text-slate-400 font-noto" 
                            placeholder="بحث في المبادرات والوثائق..." 
                            type="text" 
                        />
                    </label>
                </div>

                {/* Mobile Title (visible only when search is hidden) */}
                <div className="sm:hidden flex-1 text-center text-dge-tech-blue font-bold text-sm">
                    تقرير التحول الرقمي
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <button className="p-2 text-dge-tech-blue hover:bg-dge-tech-blue/10 rounded-lg transition-colors">
                        <span className="material-symbols-outlined fill-1">bookmark</span>
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;