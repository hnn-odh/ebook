import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker to a CDN that matches the react-pdf version.
// Using unpkg for reliability in this specific sandbox.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface BookViewProps {
    file: string;
    pageNumber: number;
    scale: number;
    onLoadSuccess: (numPages: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

const BookView: React.FC<BookViewProps> = ({ file, pageNumber, scale, onLoadSuccess, onZoomIn, onZoomOut }) => {
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate effective width for pages based on container
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        onLoadSuccess(numPages);
    };

    // Determine if we show 1 or 2 pages based on screen width
    const isMobile = containerWidth < 768; 
    
    // Page dimensions calculation for responsive fit
    // We want the book height to be reasonable within the view
    const pageHeight = isMobile ? 500 : 600; 

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 @container relative w-full h-full overflow-hidden">
            
            {/* Zoom Controls (Floating) */}
            <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-2">
                <button onClick={onZoomIn} className="size-11 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center text-dge-tech-blue hover:bg-dge-tech-blue hover:text-white transition-all">
                    <span className="material-symbols-outlined">add</span>
                </button>
                <button onClick={onZoomOut} className="size-11 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center text-dge-tech-blue hover:bg-dge-tech-blue hover:text-white transition-all">
                    <span className="material-symbols-outlined">remove</span>
                </button>
            </div>

            {/* Book Container */}
            <div 
                ref={containerRef}
                className="relative w-full max-w-5xl flex items-center justify-center h-full max-h-[85vh]"
            >
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex justify-center items-stretch shadow-book rounded-xl transition-all duration-300"
                    loading={
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-dge-tech-blue border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-dge-tech-blue font-medium animate-pulse">جاري تحميل التقرير...</p>
                        </div>
                    }
                    error={
                        <div className="text-red-500 bg-white p-6 rounded-xl shadow-lg border border-red-100 text-center">
                            <span className="material-symbols-outlined text-4xl mb-2 block">error</span>
                            <p>عذراً، لم نتمكن من تحميل الملف.</p>
                            <p className="text-sm mt-2 text-slate-400">يرجى التحقق من الاتصال بالإنترنت</p>
                        </div>
                    }
                >
                    {/* 
                      RTL Logic for PDF Books:
                      Page N (Right) | Page N+1 (Left)
                      If we are on page 1, we often just show page 1 on the right or centered.
                      However, standard PDF viewers often treat p1 as cover (single).
                      For this UI, let's assume p1 is cover, then p2-p3 are spreads.
                    */}

                    {/* Left Side Page (Next Page) - Only visible on desktop if exists */}
                    {!isMobile && (pageNumber + 1) > 0 && ( /* Usually pageNumber is the right side in RTL */ 
                        <div className="hidden md:flex flex-1 bg-white rounded-l-xl overflow-hidden relative border-l border-y border-slate-200">
                             {/* Only render next page if it exists. Note: pageNumber is usually odd in book view (1, 3, 5). 
                                If pageNumber=1 (cover), page 2 is on the 'back' of cover, usually shown as next spread 2-3.
                                Let's adopt strict dual view: Current is Right, Next is Left.
                             */}
                             <div className="opacity-90 relative z-10 h-full">
                                <Page 
                                    pageNumber={pageNumber + 1} 
                                    scale={scale} 
                                    height={pageHeight}
                                    className="h-full object-contain"
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    error={<div className="flex items-center justify-center h-full text-slate-300 bg-slate-50">نهاية المستند</div>}
                                />
                             </div>
                             
                             {/* Page Number Indicator */}
                             <span className="absolute bottom-6 left-8 text-slate-400 text-sm font-medium z-20">
                                {pageNumber + 1}
                             </span>
                        </div>
                    )}

                    {/* Spine / Gutter */}
                    {!isMobile && (
                        <div className="w-1 md:w-2 h-full bg-slate-100 z-10 relative shadow-inner flex-shrink-0">
                            <div className="absolute inset-y-0 -right-4 w-8 bg-gradient-to-l from-slate-200/40 to-transparent pointer-events-none mix-blend-multiply"></div>
                            <div className="absolute inset-y-0 -left-4 w-8 bg-gradient-to-r from-slate-200/40 to-transparent pointer-events-none mix-blend-multiply"></div>
                        </div>
                    )}

                    {/* Right Side Page (Current Page) */}
                    <div className="flex-1 bg-white rounded-r-xl md:rounded-r-none md:first:rounded-r-xl md:last:rounded-l-xl overflow-hidden relative border-r border-y border-slate-200 shadow-sm md:shadow-none">
                        <div className="relative z-10 h-full bg-white">
                            <Page 
                                pageNumber={pageNumber} 
                                scale={scale} 
                                height={pageHeight}
                                className="h-full object-contain"
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        </div>

                         {/* DGE Branding Stamp (Overlay) */}
                         <div className="absolute bottom-6 right-0 left-0 px-8 flex justify-between items-center text-slate-400 border-t border-slate-100/50 pt-4 z-20 pointer-events-none">
                            <span className="text-[10px] text-dge-light-blue uppercase tracking-wide hidden md:block">DGE Branding Guidelines</span>
                            <span className="text-sm font-medium">{pageNumber}</span>
                        </div>
                    </div>

                </Document>
            </div>
        </div>
    );
};

export default BookView;