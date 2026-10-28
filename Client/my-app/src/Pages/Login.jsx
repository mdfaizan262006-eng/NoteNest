import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed.');
            }

            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));

            window.dispatchEvent(
                new Event('notenest-auth-changed')
            );

            navigate('/Dashboard');
        } catch (err) {
            setError(
                err.message || 'Unable to connect to the server.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative flex h-screen items-center justify-center overflow-hidden bg-[#F8F3F5] px-4 py-10 text-[#3A0F34]">

            {/* Subtle 2D background decorations */}

            {/* Notebook-inspired background decorations */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                {/* Soft paper-like background glow */}
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#B58A94]/10 blur-3xl" />
                <div className="absolute -bottom-40 -right-32 h-112 w-md rounded-full bg-[#C76545]/10 blur-3xl" />

                {/* Notebook page — upper left */}
                <div className="absolute left-[6%] top-[12%] hidden h-36 w-28 -rotate-12 rounded-lg border border-[#B58A94]/40 bg-white/40 shadow-sm sm:block">
                    <div className="absolute left-5 top-0 h-full border-l border-[#C76545]/35" />
                    <div className="absolute left-7 right-3 top-7 space-y-3">
                        <div className="h-px bg-[#B58A94]/40" />
                        <div className="h-px bg-[#B58A94]/40" />
                        <div className="h-px bg-[#B58A94]/40" />
                        <div className="h-px w-3/4 bg-[#B58A94]/40" />
                    </div>
                    <div className="absolute left-2 top-7 h-2 w-2 rounded-full border border-[#C76545]/50" />
                    <div className="absolute left-2 top-13 h-2 w-2 rounded-full border border-[#C76545]/50" />
                    <div className="absolute left-2 top-19] h-2 w-2 rounded-full border border-[#C76545]/50" />
                </div>

                {/* Small paper note — upper right */}
                <div className="absolute right-[9%] top-[14%] hidden h-24 w-24 rotate-6 rounded-md border border-[#B58A94]/35 bg-[#FDF9F6]/70 shadow-sm sm:block">
                    <div className="absolute right-0 top-0 h-5 w-5 border-b border-l border-[#B58A94]/30 bg-[#B58A94]/15" />
                    <div className="mx-4 mt-8 space-y-2">
                        <div className="h-px bg-[#B58A94]/50" />
                        <div className="h-px bg-[#B58A94]/50" />
                        <div className="h-px w-2/3 bg-[#B58A94]/50" />
                    </div>
                </div>

                {/* Dotted notebook grid */}
                <div
                    className="absolute bottom-[13%] left-[8%] hidden h-28 w-36 opacity-40 sm:block"
                    style={{
                        backgroundImage: 'radial-gradient(#B58A94 1px, transparent 1px)',
                        backgroundSize: '12px 12px',
                    }}
                />

                {/* Floating stationery accents */}
                <div className="absolute right-[16%] top-[42%] hidden h-3 w-3 rotate-45 border border-[#C76545]/60 sm:block" />
                <div className="absolute bottom-[22%] right-[12%] hidden h-2.5 w-2.5 rounded-full bg-[#C76545]/60 sm:block" />

                {/* Tiny four-point star */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="absolute left-[22%] top-[48%] hidden h-7 w-7 text-[#A98291]/70 sm:block"
                >
                    <path
                        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Small paperclip */}
                <svg
                    viewBox="0 0 32 48"
                    fill="none"
                    className="absolute bottom-[15%] right-[28%] hidden h-12 w-8 -rotate-12 text-[#C76545]/55 sm:block"
                >
                    <path
                        d="M20 10V32C20 39 10 39 10 32V8C10 0 24 0 24 8V34C24 47 5 47 5 34V13"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                </svg>
            </div>


            {/* Login card */}
            <section className="login-appear relative z-10 w-full max-w-md rounded-[28px] border border-[#B58A94]/30 bg-white px-6 py-9 shadow-[0_24px_70px_rgba(58,15,52,0.10)] sm:px-10 sm:py-11">

                {/* Brand */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3A0F34] text-white shadow-md shadow-[#3A0F34]/15">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <path
                                d="M7 4.75h7l4 4v10.5H7a2 2 0 0 1-2-2v-10.5a2 2 0 0 1 2-2Z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M14 4.75v4h4M8.5 13h7M8.5 16h5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <Link
                        to="/"
                        className="text-xl font-bold tracking-tight text-[#3A0F34]"
                    >
                        NoteNest
                    </Link>

                    <div className="mt-3 h-1 w-10 rounded-full bg-[#C76545]" />
                </div>

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-[#3A0F34] sm:text-[34px]">
                        Welcome back
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[#796975]">
                        Sign in to your account to continue.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-[#3A0F34]"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            className="w-full rounded-xl border border-[#E7DCE3] bg-[#FCFAFB] px-4 py-3.5 text-sm text-[#3A0F34] outline-none transition duration-200 placeholder:text-[#B3A5AF] hover:border-[#B58A94] focus:border-[#3A0F34] focus:ring-4 focus:ring-[#B58A94]/20"
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[#3A0F34]"
                            >
                                Password
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                                className="w-full rounded-xl border border-[#E7DCE3] bg-[#FCFAFB] px-4 py-3.5 pr-16 text-sm text-[#3A0F34] outline-none transition duration-200 placeholder:text-[#B3A5AF] hover:border-[#B58A94] focus:border-[#3A0F34] focus:ring-4 focus:ring-[#B58A94]/20"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-3 text-xs font-medium text-[#796975] transition hover:text-[#3A0F34]"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3A0F34] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#3A0F34]/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#4B1945] hover:shadow-lg hover:shadow-[#3A0F34]/15 focus:outline-none focus:ring-4 focus:ring-[#B58A94]/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && (
                            <span
                                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                aria-hidden="true"
                            />
                        )}
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                {/* Password reset */}
                <div className="mt-5 text-center text-sm">
                    <span className="text-[#796975]">
                        Forgot your password?
                    </span>{' '}
                    <button
                        type="button"
                        onClick={() =>
                            setError('Password reset is not implemented yet.')
                        }
                        className="font-semibold text-[#A34F3B] underline decoration-[#C76545]/40 underline-offset-4 transition hover:text-[#3A0F34]"
                    >
                        Reset password
                    </button>
                </div>

                {/* Register link */}
                <div className="my-7 flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#EDE4E9]" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#A394A0]">
                        New here?
                    </span>
                    <div className="h-px flex-1 bg-[#EDE4E9]" />
                </div>

                <p className="text-center text-sm text-[#796975]">
                    Don't have an account?{' '}
                    <Link
                        to="/Register"
                        className="font-semibold text-[#3A0F34] underline decoration-[#B58A94] underline-offset-4 transition hover:text-[#C76545]"
                    >
                        Create account
                    </Link>
                </p>

                <p className="mt-8 text-center text-xs text-[#AA9BA6]">
                    A calmer space for getting things done.
                </p>
            </section>

            <style>{`
                @keyframes loginAppear {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .login-appear {
                    animation: loginAppear 500ms ease-out both;
                }

                @media (prefers-reduced-motion: reduce) {
                    .login-appear {
                        animation: none;
                    }
                }
            `}</style>
        </main>
    );
};

export default Login;