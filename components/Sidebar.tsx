import React from 'react';
import { SidebarItem } from '../types';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onItemClick: (page: number) => void;
}

// Mock data based on the UI provided
const mockItems: SidebarItem[] = [
    { id: 1, title: 'مقدمة التحول الرقمي', page: 1, type: 'chapter' },
    { id: 2, title: 'الفصل الأول: الحوكمة', page: 4, type: 'chapter' },
    { id: 3, title: 'الفصل الثاني: الابتكار', page: 8, type: 'chapter' },
    { id: 4, title: 'استراتيجية البيانات', page: 12, type: 'section' },
    { id: 5, title: 'الخاتمة والتوصيات', page: 15, type: 'section' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onItemClick }) => {
    return (
        <aside 
            className={`
                absolute inset-y-0 right-0 z-40 w-80 bg-white border-l border-slate-200 
                transform transition-transform duration-300 shadow-2xl
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
        >
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-dge-reliable-blue text-white h-16 sm:h-20 shrink-0">
                    <h3 className="font-bold text-lg">فهرس المحتوى</h3>
                    <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
                        <span className="material-symbols-outlined cursor-pointer block">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {mockItems.map((item, index) => {
                        const isActive = false; // Could be connected to current page range
                        const formattedIndex = (index + 1).toString().padStart(2, '0');
                        
                        return (
                            <div 
                                key={item.id}
                                onClick={() => onItemClick(item.page)}
                                className={`
                                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border
                                    ${isActive 
                                        ? 'bg-dge-tech-blue/5 border-dge-tech-blue/20' 
                                        : 'hover:bg-slate-50 border-transparent'}
                                `}
                            >
                                <div 
                                    className={`
                                        w-10 h-14 rounded-sm flex items-center justify-center text-[10px] font-bold
                                        ${item.type === 'chapter' ? 'bg-dge-light-blue/20 text-dge-tech-blue' : 'bg-slate-100 text-slate-500'}
                                    `}
                                >
                                    {formattedIndex}
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${isActive ? 'text-dge-tech-blue' : 'text-slate-800'}`}>
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        صفحة <span className="dir-ltr inline-block">{item.page}</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;