
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    const location = useLocation();

    function handleLogout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        window.dispatchEvent(
            new Event('notenest-auth-changed')
        );

        setMobileMenuOpen(false);
    }

    const navItems = [
        { label: 'Dashboard', to: '/Dashboard', icon: '◈' },
        { label: 'All Tasks', to: '/Dashboard/Alltasks', icon: '▤' },
        { label: 'Favorites', to: '/Dashboard/Favorites', icon: '☆' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-[#3A0F34]/50 backdrop-blur-sm md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col overflow-y-auto border-r border-white/10 bg-[#3A0F34] p-5 text-[#F5EDEF] shadow-2xl shadow-[#3A0F34]/20 transition-transform duration-300 ease-out md:z-30 md:w-60 md:translate-x-0 md:shadow-none ${mobileMenuOpen
                        ? 'translate-x-0'
                        : '-translate-x-full md:translate-x-0'
                    }`}
            >
                {/* Brand */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B58A94]/15 text-2xl text-[#B58A94]">
                            ◈
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-[#F5EDEF]">
                            NoteNest<span className="text-[#C76545]">.</span>
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close sidebar"
                        className="rounded-lg px-3 py-1 text-2xl text-[#B58A94] transition-colors hover:bg-white/10 hover:text-white md:hidden"
                    >
                        ×
                    </button>
                </div>

                <p className="mt-3 pl-1 text-sm text-[#B58A94]">
                    Your space to focus.
                </p>

                {/* Navigation heading */}
                <div className="mb-3 mt-10 flex items-center gap-3">
                    <span className="h-px flex-1 bg-white/10" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B58A94]/80">
                        Workspace
                    </p>
                    <span className="h-px flex-1 bg-white/10" />
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {navItems.map(item => {
                        const isActive =
                            location.pathname === item.to;

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ease-out ${isActive
                                        ? 'translate-x-0.5 bg-[#B58A94] text-[#3A0F34] shadow-lg shadow-black/10'
                                        : 'text-[#F5EDEF]/75 hover:translate-x-1 hover:bg-white/[0.07] hover:text-white'
                                    }`}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <span className="absolute inset-y-2 right-0 w-1 rounded-l-full bg-[#C76545]" />
                                )}

                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all duration-200 ${isActive
                                            ? 'bg-white/25 text-[#3A0F34]'
                                            : 'bg-white/5 text-[#B58A94] group-hover:bg-[#B58A94]/15 group-hover:text-[#D9B7BF]'
                                        }`}
                                >
                                    {item.icon}
                                </span>

                                <span>{item.label}</span>

                                {isActive && (
                                    <span className="ml-auto text-xs text-[#3A0F34]/70">
                                        ●
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom decorative card */}
                <div className="relative mt-auto mb-5 overflow-hidden rounded-2xl border border-[#B58A94]/20 bg-linear-to-br from-[#B58A94]/15 to-[#C76545]/10 p-4">
                    <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#C76545]/10 blur-xl" />

                    <div className="relative">
                        <span className="text-xl text-[#C76545]">✦</span>

                        <p className="mt-2 text-sm font-semibold text-[#F5EDEF]">
                            One thing at a time.
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-[#B58A94]">
                            Keep your thoughts organized and your focus clear.
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <div className="border-t border-white/10 pt-4">
                    <Link
                        to="/Login"
                        onClick={handleLogout}
                        className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#F5EDEF]/70 transition-all duration-200 hover:bg-[#C76545]/15 hover:text-[#E58A6D]"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-lg transition-colors group-hover:bg-[#C76545]/15">
                            ↪
                        </span>

                        <span>Log out</span>
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
