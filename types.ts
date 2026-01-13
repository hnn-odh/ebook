export interface SidebarItem {
    id: number;
    title: string;
    page: number;
    type: 'chapter' | 'section';
}

export interface ViewerState {
    numPages: number | null;
    pageNumber: number;
    scale: number;
    isSidebarOpen: boolean;
}