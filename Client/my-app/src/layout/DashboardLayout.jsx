
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

const DashboardLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F4F1] text-[#393936]">
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            <main className="min-w-0 md:ml-60">
                {/* Mobile menu button */}
                <div className="p-5 pb-0 sm:p-8 sm:pb-0 md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-[#393936] px-4 py-2 text-white"
                    >
                        <span className="text-xl">☰</span>
                        Menu
                    </button>
                </div>

                {/* Current page appears here */}
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
