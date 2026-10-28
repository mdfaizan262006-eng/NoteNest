
const NotebookBg = () => {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
            {/* Soft background glow */}
            <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#E8D5DB]/40 blur-3xl" />
            <div className="absolute -right-32 top-[35%] h-96 w-96 rounded-full bg-[#F4E2DC]/50 blur-3xl" />
            <div className="absolute bottom-0 left-[35%] h-72 w-72 rounded-full bg-[#E8D5DB]/30 blur-3xl" />

            {/* Top-left light notebook */}
            <div className="absolute -left-12 top-32 hidden h-64 w-48 -rotate-12 rounded-2xl border border-[#E4D5DC] bg-[#FFFCF8]/80 shadow-sm sm:block">
                <div className="absolute left-4 right-4 top-5 h-px bg-[#E9DDE2]" />
                <div className="absolute left-4 right-4 top-9 h-px bg-[#E9DDE2]" />
                <div className="absolute left-4 right-4 top-13 h-px bg-[#E9DDE2]" />
                <div className="absolute left-4 right-4 top-17 h-px bg-[#E9DDE2]" />

                <div className="absolute -right-2 top-5 flex flex-col gap-3">
                    {Array.from({ length: 7 }, (_, i) => (
                        <span
                            key={i}
                            className="h-3 w-3 rounded-full border-2 border-[#D8C7D1] bg-[#F8F3F5]"
                        />
                    ))}
                </div>
            </div>

            {/* Top-right notebook */}
            <div className="absolute -right-10 top-24 hidden h-52 w-40 rotate-12 rounded-2xl border border-[#E5D5DA] bg-[#FCEFEB]/80 shadow-sm md:block">
                <div className="absolute left-4 right-4 top-7 h-px bg-[#E8D7D8]" />
                <div className="absolute left-4 right-4 top-12 h-px bg-[#E8D7D8]" />
                <div className="absolute left-4 right-4 top-15 h-px bg-[#E8D7D8]" />
                <div className="absolute left-4 right-4 top-20 h-px bg-[#E8D7D8]" />

                <div className="absolute -left-2 top-5 flex flex-col gap-3">
                    {Array.from({ length: 6 }, (_, i) => (
                        <span
                            key={i}
                            className="h-3 w-3 rounded-full border-2 border-[#D8C7D1] bg-[#F8F3F5]"
                        />
                    ))}
                </div>
            </div>

            {/* Bottom-left notebook */}
            <div className="absolute -bottom-20 left-[12%] hidden h-44 w-36 rotate-6 rounded-2xl border border-[#E5D5DA] bg-[#F8E9E7]/70 shadow-sm lg:block">
                <div className="absolute left-4 right-4 top-7 h-px bg-[#E7D4D6]" />
                <div className="absolute left-4 right-4 top-12 h-px bg-[#E7D4D6]" />
                <div className="absolute left-4 right-4 top-15 h-px bg-[#E7D4D6]" />

                <div className="absolute -top-2 left-5 flex gap-3">
                    {Array.from({ length: 5 }, (_, i) => (
                        <span
                            key={i}
                            className="h-3 w-3 rounded-full border-2 border-[#D8C7D1] bg-[#F8F3F5]"
                        />
                    ))}
                </div>
            </div>

            {/* Small stationery accents */}
            <div className="absolute right-[22%] top-[55%] h-2 w-2 rounded-full bg-[#C76545]/20" />
            <div className="absolute left-[28%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#B58A94]/40" />
            <div className="absolute right-[12%] bottom-[18%] h-3 w-3 rotate-45 border border-[#B58A94]/30" />
        </div>
    );
};

export default NotebookBg;
