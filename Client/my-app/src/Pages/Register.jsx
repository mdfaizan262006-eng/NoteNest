import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            setSuccess('Account created successfully! Redirecting to login...');

            setTimeout(() => {
                navigate('/Login');
            }, 1200);
        } catch (err) {
            setError(err.message || 'Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        'h-11 w-full rounded-xl border border-[#E8DCE3] bg-[#FFFCFD] px-4 text-sm text-[#3A0F34] placeholder:text-[#B8A6B0] outline-none transition duration-200 focus:border-[#8A527D] focus:bg-white focus:ring-4 focus:ring-[#B58A94]/15';

    return (
        <div className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#F8F3F5] px-4 py-3 text-[#3A0F34]">

            {/* Soft, flat background decorations */}

            {/* Light notebook-inspired background decorations */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                {/* Soft background washes */}
                <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#E8D7E1]/55 blur-2xl" />
                <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#F1D9CF]/60 blur-2xl" />

                {/* Cream spiral notebook — upper left */}
                <div className="absolute left-[5%] top-[12%] hidden -rotate-12 sm:block">
                    <div className="relative h-40 w-28 rounded-r-lg border border-[#E4D5D9] bg-[#FFFCF6] shadow-lg shadow-[#B58A94]/10">
                        {/* Paper ruling */}
                        <div
                            className="absolute bottom-3 left-7 right-3 top-4"
                            style={{
                                backgroundImage:
                                    'repeating-linear-gradient(to bottom, transparent 0px, transparent 15px, #DCCBD4 16px)',
                            }}
                        />
                        <div className="absolute bottom-3 left-8 top-4 border-l border-[#E9B9AD]/60" />

                        {/* Light spiral rings */}
                        <div className="absolute -left-1.5 top-3 flex h-[calc(100%-24px)] flex-col justify-between">
                            {Array.from({ length: 7 }, (_, i) => (
                                <span
                                    key={i}
                                    className="h-3.5 w-3.5 rounded-full border-2 border-[#CDBAC8] bg-[#F8F3F5]"
                                />
                            ))}
                        </div>

                        {/* Tiny cover label */}
                        <div className="absolute right-3 top-3 h-3 w-8 rounded-sm border border-[#DCCBD4] bg-[#F5E8ED]" />
                    </div>
                </div>

                {/* Blush notebook — upper right */}
                <div className="absolute right-[7%] top-[14%] hidden rotate-10 sm:block">
                    <div className="relative h-32 w-24 rounded-r-lg border border-[#E4CDD2] bg-[#F8E9E8] shadow-lg shadow-[#B58A94]/10">
                        <div className="absolute inset-2 rounded border border-[#E7CDD4]/80" />

                        <div className="absolute left-6 right-3 top-8 space-y-3">
                            <div className="h-px bg-[#D9B9C7]/70" />
                            <div className="h-px bg-[#D9B9C7]/70" />
                            <div className="h-px w-3/4 bg-[#D9B9C7]/70" />
                        </div>

                        {/* Light spiral rings */}
                        <div className="absolute -left-1.5 top-2 flex h-[calc(100%-16px)] flex-col justify-between">
                            {Array.from({ length: 6 }, (_, i) => (
                                <span
                                    key={i}
                                    className="h-3 w-3 rounded-full border-2 border-[#CDBAC8] bg-[#F8F3F5]"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Small notebook — lower left */}
                <div className="absolute bottom-[9%] left-[13%] hidden rotate-[8deg] sm:block">
                    <div className="relative h-28 w-20 rounded-r-lg border border-[#E4D5D9] bg-[#F6EDE0] shadow-lg shadow-[#B58A94]/10">
                        <div className="absolute left-5 right-2 top-6 space-y-3">
                            <div className="h-px bg-[#DCCBD4]" />
                            <div className="h-px bg-[#DCCBD4]" />
                            <div className="h-px w-3/4 bg-[#DCCBD4]" />
                        </div>

                        {/* Light spiral rings */}
                        <div className="absolute -left-1.5 top-2 flex h-[calc(100%-16px)] flex-col justify-between">
                            {Array.from({ length: 5 }, (_, i) => (
                                <span
                                    key={i}
                                    className="h-3 w-3 rounded-full border-2 border-[#CDBAC8] bg-[#F8F3F5]"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dotted stationery accent */}
                <div
                    className="absolute bottom-[15%] right-[12%] hidden h-24 w-28 opacity-40 sm:block"
                    style={{
                        backgroundImage: 'radial-gradient(#B58A94 1px, transparent 1px)',
                        backgroundSize: '12px 12px',
                    }}
                />

                {/* Small four-point star */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="absolute right-[23%] top-[43%] hidden h-7 w-7 text-[#D0B5C7] sm:block"
                >
                    <path
                        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>


            <div className="relative z-10 w-full max-w-md animate-[registerAppear_0.55s_ease-out]">

                {/* Brand */}
                <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="flex h-10 w-11 items-center justify-center rounded-2xl bg-[#3A0F34] text-[#F8F3F5] shadow-md shadow-[#3A0F34]/15">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <path
                                d="M6 3.75h8l4 4v12.5H6a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M14 3.75v4h4M8 12h8M8 15.5h6"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <span className="text-2xl font-bold tracking-tight text-[#3A0F34]">
                        NoteNest
                    </span>
                </div>

                {/* Register card */}
                <div className="rounded-3xl border border-[#E8DCE3] bg-white/95 p-5 shadow-[0_20px_60px_-25px_rgba(58,15,52,0.22)] sm:p-6">

                    <div className="mb-4 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5E8ED] text-[#8A527D]">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-6 w-6"
                                aria-hidden="true"
                            >
                                <path
                                    d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-[#3A0F34] sm:text-3xl">
                            Create your account
                        </h1>

                        <p className="mt-2 text-sm leading-5 text-[#8D7A87]">
                            A fresh start for your thoughts and tasks.
                        </p>
                    </div>

                    <form
                        className="flex flex-col gap-3"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="name"
                                className="text-sm font-semibold text-[#493343]"
                            >
                                Full name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Alex Morgan"
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="email"
                                className="text-sm font-semibold text-[#493343]"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold text-[#493343]"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
                                    className={`${inputClass} pr-16`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 text-xs font-semibold text-[#8A527D] transition hover:text-[#3A0F34]"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-semibold text-[#493343]"
                            >
                                Confirm password
                            </label>

                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your password again"
                                    className={`${inputClass} pr-16`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-3 text-xs font-semibold text-[#8A527D] transition hover:text-[#3A0F34]"
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        {success && (
                            <p
                                role="status"
                                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
                            >
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-[#3A0F34] px-4 font-semibold text-white shadow-md shadow-[#3A0F34]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#512047] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#B58A94]/35 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Creating account...
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[#EEE4E9]" />
                        <span className="text-xs text-[#A4939E]">
                            ALREADY A MEMBER?
                        </span>
                        <div className="h-px flex-1 bg-[#EEE4E9]" />
                    </div>

                    <p className="text-center text-sm text-[#806E7B]">
                        Have an account?{' '}
                        <Link
                            to="/Login"
                            className="font-bold text-[#8A527D] underline-offset-4 transition hover:text-[#3A0F34] hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>

                <p className="mt-3 text-center text-xs tracking-wide text-[#A4939E]">
                    A calmer space for getting things done.
                </p>
            </div>

            <style>{`
                @keyframes registerAppear {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-\\[registerAppear_0\\.55s_ease-out\\] {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Register;
