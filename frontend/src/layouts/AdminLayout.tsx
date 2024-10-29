import { Sidebar } from '../pages/admin/Sidebar';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export const AdminLayout = ({ children }: LayoutProps) => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};
