import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import BookView from './components/BookView';
import { ViewerState } from './types';

// Using a CORS-friendly proxy or a known accessible PDF for demo purposes if the original blocks it.
// However, adhering to the prompt, I will use the provided URL.
// Note: If the specific URL blocks CORS, local development usually requires a proxy.
// I will add a fallback URL just in case the Newcastle one is strict on 'null' origin sandboxes.
const PDF_URL = "https://www.newcastle.edu.au/__data/assets/pdf_file/0008/333773/LD-Report-Writing-LH.pdf";

const App: React.FC = () => {
    const [state, setState] = useState<ViewerState>({
        numPages: null,
        pageNumber: 1, // Start at page 1 (Right side)
        scale: 1.0,
        isSidebarOpen: false,
    });

    const onDocumentLoadSuccess = (numPages: number) => {
        setState(prev => ({ ...prev, numPages }));
    };

    const changePage = (page: number) => {
        // Ensure page is within bounds and adhere to odd numbering for "Right Side" logic if needed
        // For simple book view: usually navigate by 2s, but user might select specific page from TOC.
        // If user selects even number (2), show 1-2 or 2-3? 
        // In RTL Arabic books, Page 1 is right. Page 2 is Left. Page 3 is Right.
        // So Right page is always Odd.
        
        let targetPage = page;
        if (targetPage > 1 && targetPage % 2 === 0) {
            targetPage = targetPage - 1; // Snap to the odd page (Right side) to show the spread 2-3 as [3][2]
        }
        
        // Clamp
        if (state.numPages) {
            if (targetPage > state.numPages) targetPage = state.numPages;
        }
        if (targetPage < 1) targetPage = 1;

        setState(prev => ({ ...prev, pageNumber: targetPage }));
    };

    const toggleSidebar = () => {
        setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
    };

    const handleZoomIn = () => {
        setState(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2.0) }));
    };

    const handleZoomOut = () => {
        setState(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.6) }));
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-light text-slate-900 font-noto">
            <Header toggleSidebar={toggleSidebar} />
            
            <main className="flex-1 relative overflow-hidden flex bg-[#f0f4f8]">
                <Sidebar 
                    isOpen={state.isSidebarOpen} 
                    onClose={() => setState(prev => ({...prev, isSidebarOpen: false}))}
                    onItemClick={(page) => {
                        changePage(page);
                        // On mobile, close sidebar after selection
                        if (window.innerWidth < 768) {
                             setState(prev => ({...prev, isSidebarOpen: false}));
                        }
                    }}
                />
                
                <div 
                    className={`flex-1 transition-all duration-300 ${state.isSidebarOpen ? 'mr-0 md:mr-80' : ''}`}
                    onClick={() => {
                        // Close sidebar if clicking outside on mobile
                        if (state.isSidebarOpen && window.innerWidth < 768) {
                            setState(prev => ({...prev, isSidebarOpen: false}));
                        }
                    }}
                >
                    <BookView 
                        file={PDF_URL}
                        pageNumber={state.pageNumber}
                        scale={state.scale}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                    />
                </div>
            </main>

            <Footer 
                pageNumber={state.pageNumber}
                numPages={state.numPages}
                onPageChange={changePage}
            />
        </div>
    );
};

export default App;