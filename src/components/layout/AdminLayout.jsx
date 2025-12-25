// src/components/layout/AdminLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Fixed width, clean border */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Header - Sejajar dengan Sidebar */}
                <Header />

                {/* Main Content - Padding konsisten */}
                <main className="flex-1 p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}