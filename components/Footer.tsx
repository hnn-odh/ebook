import React from 'react';

interface FooterProps {
    pageNumber: number;
    numPages: number | null;
    onPageChange: (page: number) => void;
}

const Footer: React.FC<FooterProps> = ({ pageNumber, numPages, onPageChange }) => {
    const total = numPages || 0;
    
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onPageChange(Number(e.target.value));
    };

    const nextPage = () => {
        if (pageNumber < total) onPageChange(pageNumber + 2); // Jump 2 for book view
    };

    const prevPage = () => {
        if (pageNumber > 1) onPageChange(pageNumber - 2);
    };

    // Calculate percentage for progress bar visual
    const progressPercent = total > 0 ? ((pageNumber / total) * 100) : 0;

    return (
        <footer className="z-30 bg-white border-t border-slate-200 p-4 shrink-0 transition-all duration-300">
            <div className="max-w-screen-md mx-auto space-y-4 sm:space-y-6">
                {/* Progress Section */}
                <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-xs text-slate-500 font-medium">تصفح الصفحات</span>
                        <span className="text-sm font-bold text-dge-tech-blue dir-ltr">
                            {pageNumber} <span className="text-slate-400 mx-1">/</span> {total}
                        </span>
                    </div>
                    
                    {/* Custom Range Slider using standard input for better a11y/interaction than custom divs */}
                    <div className="relative h-8 flex items-center group w-full">
                        <input
                            type="range"
                            min={1}
                            max={total || 1}
                            value={pageNumber}
                            onChange={handleSliderChange}
                            className="absolute w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer z-20 opacity-0"
                        />
                        {/* Custom Visual Track */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative z-10">
                            <div 
                                className="h-full bg-dge-tech-blue transition-all duration-300 ease-out rounded-full" 
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        {/* Custom Thumb */}
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-[3px] border-dge-tech-blue rounded-full shadow-lg transition-transform group-hover:scale-110 pointer-events-none z-10"
                            style={{ 
                                /* RTL Logic: Since the bar fills from right to left in RTL, we need to position 'right' instead of 'left' if direction is RTL. 
                                   But React style orientation depends on browser. Let's assume RTL context. */
                                right: `calc(${progressPercent}% - 12px)`, 
                                left: 'auto'
                            }}
                        ></div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-4">
                    <button 
                        onClick={prevPage}
                        disabled={pageNumber <= 1}
                        className="flex-1 h-12 sm:h-14 flex items-center justify-center gap-2 bg-slate-50 text-dge-reliable-blue border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all text-sm sm:text-base"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span>الصفحة السابقة</span>
                    </button>
                    <button 
                        onClick={nextPage}
                        disabled={pageNumber >= total}
                        className="flex-1 h-12 sm:h-14 flex items-center justify-center gap-2 bg-dge-tech-blue text-white hover:bg-dge-reliable-blue disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold shadow-lg shadow-dge-tech-blue/20 transition-all text-sm sm:text-base"
                    >
                        <span>الصفحة التالية</span>
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;