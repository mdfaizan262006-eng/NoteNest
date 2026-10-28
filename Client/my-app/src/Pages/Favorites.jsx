
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../TaskContext'
import NotebookBg from '../Components/NotebookBg'

const Favorites = () => {
    const {
        tasks,
        editTask,
        deleteTask,
        toggleTask,
        toggleFavorite,
    } = useTasks()

    const [editingTask, setEditingTask] = useState(null)
    const [saving, setSaving] = useState(false)
    const [actionError, setActionError] = useState('')
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')

    const favoriteTasks = useMemo(() => {
        return tasks.filter(task => {
            const isFavorite = task.favorite

            const matchesSearch =
                `${task.title || ''} ${task.description || ''}`
                    .toLowerCase()
                    .includes(search.trim().toLowerCase())

            const matchesFilter =
                filter === 'All' ||
                (filter === 'Pending' && !task.done) ||
                (filter === 'Completed' && task.done)

            return isFavorite && matchesSearch && matchesFilter
        })
    }, [tasks, search, filter])

    const totalFavorites = tasks.filter(task => task.favorite).length
    const completedFavorites = tasks.filter(
        task => task.favorite && task.done
    ).length
    const pendingFavorites = totalFavorites - completedFavorites

    const priorityStyles = {
        High: 'bg-[#FCE7E3] text-[#B94B37]',
        Medium: 'bg-[#F4E8F0] text-[#854D70]',
        Low: 'bg-[#E5F2E9] text-[#347653]',
    }

    const formatDate = date => {
        if (!date) return 'No due date'

        const parsedDate = new Date(`${date}T00:00:00`)

        if (Number.isNaN(parsedDate.getTime())) return date

        return parsedDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }

    const openEdit = task => {
        setActionError('')
        setEditingTask({
            ...task,
            category: task.category || 'Personal',
            priority: task.priority || 'Medium',
            date: task.date || '',
            description: task.description || '',
        })
    }

    const handleSave = async e => {
        e.preventDefault()

        if (!editingTask?.title?.trim() || saving) return

        const { id, ...updatedTask } = editingTask

        setSaving(true)
        setActionError('')

        try {
            await editTask(id, {
                ...updatedTask,
                title: updatedTask.title.trim(),
                description: updatedTask.description.trim(),
            })

            setEditingTask(null)
        } catch (error) {
            setActionError(
                error.message || 'Could not update the task. Please try again.'
            )
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async task => {
        if (!window.confirm(`Delete "${task.title}" permanently?`)) return

        setActionError('')

        try {
            await deleteTask(task.id)
        } catch (error) {
            setActionError(
                error.message || 'Could not delete the task. Please try again.'
            )
        }
    }

    return (
        <div className="relative isolate min-h-screen bg-[#F8F3F5] px-4 py-6 text-[#3A0F34] sm:px-7 sm:py-9 lg:px-10">

            <NotebookBg />

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Header */}
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3A0F34] text-2xl text-white shadow-lg shadow-[#3A0F34]/15 transition duration-300 hover:rotate-6 hover:scale-105">
                            <span>✦</span>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#B58A94]">
                                Your personal space
                            </p>
                            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                Favorite Tasks
                            </h1>
                        </div>
                    </div>

                    <Link
                        to="/Dashboard"
                        className="group inline-flex items-center gap-2 rounded-xl border border-[#E6D5DE] bg-white/80 px-4 py-3 text-sm font-bold shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B58A94] hover:bg-white hover:shadow-lg"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>
                        Dashboard
                    </Link>
                </header>

                {/* Hero section */}
                <section className="relative mb-8 overflow-hidden rounded-4xl bg-linear-to-br from-[#3A0F34] via-[#59264E] to-[#86516F] p-6 text-white shadow-xl shadow-[#3A0F34]/15 sm:p-9 lg:p-11">
                    <div className="pointer-events-none absolute -right-8 -top-16 h-64 w-64 rounded-full border-35 border-white/5" />
                    <div className="pointer-events-none absolute -bottom-17.5 right-28 h-48 w-48 rounded-full bg-[#C76545]/25 blur-2xl" />

                    <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
                        <div className="max-w-2xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-[#F6DCE4] backdrop-blur-sm">
                                <span className="text-[#F4B7A6]">★</span>
                                THE TASKS THAT MATTER MOST
                            </div>

                            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                Keep your
                                <span className="block text-[#F0C3D4]">
                                    priorities close.
                                </span>
                            </h2>

                            <p className="mt-4 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
                                Your most important tasks, collected in one
                                place. Stay focused on what deserves your
                                attention.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    to="/Dashboard/Alltasks"
                                    className="rounded-xl bg-[#F1C9B7] px-5 py-3 text-sm font-bold text-[#3A0F34] shadow-md transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                                >
                                    Explore all tasks →
                                </Link>

                                <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/85 backdrop-blur-sm">
                                    <span className="text-[#F0C3D4]">✦</span>
                                    Stay focused
                                </div>
                            </div>
                        </div>

                        <div className="hidden h-44 w-44 items-center justify-center rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md md:flex lg:h-52 lg:w-52">
                            <div className="flex h-32 w-32 items-center justify-center rounded-4xl bg-linear-to-br from-[#F4D8E3] to-[#C76545] text-7xl shadow-xl transition duration-500 hover:rotate-6 hover:scale-110 lg:h-40 lg:w-40 lg:text-8xl">
                                ★
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                        {
                            label: 'Total Favorites',
                            value: totalFavorites,
                            icon: '★',
                            color: '#854D70',
                            bg: '#F2E5EF',
                            note: 'Saved for later',
                        },
                        {
                            label: 'Still Pending',
                            value: pendingFavorites,
                            icon: '◷',
                            color: '#B65D42',
                            bg: '#FBE9E1',
                            note: 'Waiting for you',
                        },
                        {
                            label: 'Completed',
                            value: completedFavorites,
                            icon: '✓',
                            color: '#347653',
                            bg: '#E5F2E9',
                            note: 'Great progress',
                        },
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="group rounded-2xl border border-[#EADCE3] bg-white/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#D8B6C6] hover:shadow-xl hover:shadow-[#3A0F34]/5 sm:p-6"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-[#8C7785]">
                                        {stat.label}
                                    </p>
                                    <p className="mt-2 text-3xl font-black tracking-tight text-[#3A0F34]">
                                        {stat.value}
                                    </p>
                                </div>

                                <div
                                    style={{
                                        backgroundColor: stat.bg,
                                        color: stat.color,
                                    }}
                                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition duration-300 group-hover:rotate-6 group-hover:scale-110"
                                >
                                    {stat.icon}
                                </div>
                            </div>

                            <p className="mt-4 text-xs font-medium text-[#9B8995]">
                                {stat.note}
                            </p>

                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F3EAF0]">
                                <div
                                    style={{
                                        width: totalFavorites
                                            ? `${(stat.value / totalFavorites) * 100}%`
                                            : '0%',
                                        backgroundColor: stat.color,
                                    }}
                                    className="h-full rounded-full transition-all duration-700"
                                />
                            </div>
                        </div>
                    ))}
                </section>

                {/* Search and filters */}
                <section className="mb-6 rounded-2xl border border-[#EADCE3] bg-white/90 p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold">
                                Your collection
                            </h2>
                            <p className="mt-1 text-sm text-[#998695]">
                                Search and organize your favorite tasks.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative sm:min-w-64">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#B58A94]">
                                    ⌕
                                </span>

                                <input
                                    type="search"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search favorites..."
                                    aria-label="Search favorite tasks"
                                    className="w-full rounded-xl border border-[#EADCE3] bg-[#FCF9FB] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#B58A94] focus:bg-white focus:ring-4 focus:ring-[#B58A94]/15"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {['All', 'Pending', 'Completed'].map(option => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setFilter(option)}
                                        className={`rounded-xl px-4 py-3 text-sm font-bold transition duration-200 ${filter === option
                                            ? 'bg-[#3A0F34] text-white shadow-md shadow-[#3A0F34]/15'
                                            : 'border border-[#EADCE3] bg-white text-[#856D7E] hover:border-[#B58A94] hover:bg-[#F8EFF4]'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Result heading and action errors */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-black">
                            {filter === 'All' ? 'All saved tasks' : `${filter} favorites`}
                        </h2>
                        <p className="mt-1 text-sm text-[#998695]">
                            Showing {favoriteTasks.length} of {totalFavorites} favorite tasks
                        </p>
                    </div>

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="text-sm font-bold text-[#9B567D] transition hover:text-[#3A0F34]"
                        >
                            Clear search ×
                        </button>
                    )}
                </div>

                {actionError && !editingTask && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-[#F0C7BE] bg-[#FFF0EC] p-4 text-sm font-medium text-[#A13D30]"
                    >
                        {actionError}
                    </div>
                )}

                {/* Favorite task cards */}
                {favoriteTasks.length === 0 ? (
                    <div className="rounded-4xl border-2 border-dashed border-[#DEC8D5] bg-white/80 px-5 py-14 text-center shadow-sm sm:py-20">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-4xl bg-linear-to-br from-[#F7E7EF] to-[#FBE5DA] text-5xl text-[#B58A94] shadow-inner">
                            {search || filter !== 'All' ? '⌕' : '☆'}
                        </div>

                        <h2 className="text-2xl font-black text-[#3A0F34]">
                            {search || filter !== 'All'
                                ? 'No matching favorites'
                                : 'Your favorites start here'}
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#998695]">
                            {search || filter !== 'All'
                                ? 'Try another search or change the selected filter to find your saved tasks.'
                                : 'Save the tasks that matter most by clicking the star on any task. They will appear here whenever you need them.'}
                        </p>

                        {search || filter !== 'All' ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('')
                                    setFilter('All')
                                }}
                                className="mt-6 rounded-xl bg-[#3A0F34] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#59264E]"
                            >
                                Clear filters
                            </button>
                        ) : (
                            <Link
                                to="/Dashboard/Alltasks"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3A0F34] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#3A0F34]/15 transition duration-300 hover:-translate-y-1 hover:bg-[#59264E] hover:shadow-xl"
                            >
                                Find tasks to save <span>→</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {favoriteTasks.map((task, index) => (
                            <article
                                key={task.id}
                                className="group relative overflow-hidden rounded-[1.6rem] border border-[#EADCE3] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#D8B6C6] hover:shadow-2xl hover:shadow-[#3A0F34]/10"
                            >
                                {/* Accent strip */}
                                <div
                                    className={`h-1.5 ${task.priority === 'High'
                                        ? 'bg-[#C76545]'
                                        : task.priority === 'Low'
                                            ? 'bg-[#78A98B]'
                                            : 'bg-[#B58A94]'
                                        }`}
                                />

                                <div className="p-5 sm:p-6">
                                    {/* Card top */}
                                    <div className="mb-5 flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#F7EDF2] transition group-hover:bg-[#F0DDE7]">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(task.done)}
                                                    onChange={() => toggleTask(task.id)}
                                                    aria-label={`Mark ${task.title} as ${task.done ? 'pending' : 'completed'}`}
                                                    className="h-4 w-4 cursor-pointer accent-[#3A0F34]"
                                                />
                                            </label>

                                            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#B58A94]">
                                                SAVED TASK
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleFavorite(task.id)}
                                            title="Remove from favorites"
                                            aria-label={`Remove ${task.title} from favorites`}
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E9] text-xl text-[#C76545] transition duration-300 hover:rotate-12 hover:scale-110 hover:bg-[#C76545] hover:text-white"
                                        >
                                            ★
                                        </button>
                                    </div>

                                    {/* Title and description */}
                                    <h3
                                        className={`wrap-break-word text-xl font-extrabold leading-snug tracking-tight transition ${task.done
                                            ? 'text-[#B8AAB5] line-through'
                                            : 'text-[#3A0F34]'
                                            }`}
                                    >
                                        {task.title}
                                    </h3>

                                    <p className="mt-3 min-h-12 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-[#917E8D]">
                                        {task.description || 'No description provided.'}
                                    </p>

                                    {/* Tags */}
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <span className="rounded-lg bg-[#F5EDF2] px-3 py-1.5 text-xs font-bold text-[#79566D]">
                                            {task.category || 'Personal'}
                                        </span>

                                        <span
                                            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${priorityStyles[task.priority] ||
                                                priorityStyles.Medium
                                                }`}
                                        >
                                            {task.priority || 'Medium'} Priority
                                        </span>

                                        <span
                                            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${task.done
                                                ? 'bg-[#E5F2E9] text-[#347653]'
                                                : 'bg-[#FFF0E8] text-[#B65D42]'
                                                }`}
                                        >
                                            {task.done ? '✓ Completed' : '◷ Pending'}
                                        </span>
                                    </div>

                                    {/* Due date */}
                                    <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#FCF8FA] p-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                                            ♧
                                        </span>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#AD98A7]">
                                                Due date
                                            </p>
                                            <p className="mt-0.5 text-sm font-bold text-[#67485F]">
                                                {formatDate(task.date)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card actions */}
                                    <div className="mt-5 flex gap-3 border-t border-[#F0E6EC] pt-4">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(task)}
                                            className="flex-1 rounded-xl border border-[#E6D5DE] bg-white px-4 py-3 text-sm font-bold text-[#6E4262] transition duration-200 hover:border-[#B58A94] hover:bg-[#F8EFF4]"
                                        >
                                            ✎ Edit task
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(task)}
                                            className="rounded-xl border border-[#F2DAD5] bg-[#FFF7F5] px-4 py-3 text-sm font-bold text-[#B94B37] transition duration-200 hover:border-[#C76545] hover:bg-[#C76545] hover:text-white"
                                            aria-label={`Delete ${task.title}`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Hover decoration */}
                                <div
                                    className="pointer-events-none absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-[#F2DDE7]/40 blur-2xl transition duration-500 group-hover:scale-150"
                                    style={{ transitionDelay: `${index * 10}ms` }}
                                />
                            </article>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8D8E1] py-6 text-xs text-[#A18D9B]">
                    <p>NoteNest · Keep what matters close.</p>
                    <p>{completedFavorites} of {totalFavorites} favorites completed</p>
                </footer>
            </div>

            {/* Edit modal */}
            {editingTask && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#25101F]/55 p-4 backdrop-blur-md"
                    onMouseDown={e => {
                        if (e.target === e.currentTarget && !saving) {
                            setEditingTask(null)
                            setActionError('')
                        }
                    }}
                >
                    <form
                        onSubmit={handleSave}
                        className="my-auto w-full max-w-xl space-y-5 rounded-4xl border border-white/70 bg-[#FFFCFD] p-5 shadow-2xl shadow-[#210D1D]/25 sm:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="mb-3 inline-flex rounded-full bg-[#F4E5ED] px-3 py-1.5 text-xs font-bold text-[#854D70]">
                                    ✦ UPDATE YOUR TASK
                                </div>

                                <h2 className="text-2xl font-black text-[#3A0F34] sm:text-3xl">
                                    Edit favorite
                                </h2>

                                <p className="mt-2 text-sm text-[#998695]">
                                    Make changes to your saved task.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setEditingTask(null)
                                    setActionError('')
                                }}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5EDF2] text-xl text-[#79566D] transition hover:bg-[#EBD8E4] disabled:opacity-50"
                                aria-label="Close edit dialog"
                            >
                                ×
                            </button>
                        </div>

                        {actionError && (
                            <div
                                role="alert"
                                className="rounded-xl border border-[#F0C7BE] bg-[#FFF0EC] p-3 text-sm text-[#A13D30]"
                            >
                                {actionError}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#67485F]">
                                Task title
                            </label>
                            <input
                                type="text"
                                value={editingTask.title || ''}
                                onChange={e =>
                                    setEditingTask({
                                        ...editingTask,
                                        title: e.target.value,
                                    })
                                }
                                required
                                maxLength={150}
                                className="w-full rounded-xl border border-[#E6D5DE] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B58A94] focus:ring-4 focus:ring-[#B58A94]/15"
                                placeholder="Give your task a title"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#67485F]">
                                Description
                            </label>
                            <textarea
                                value={editingTask.description || ''}
                                onChange={e =>
                                    setEditingTask({
                                        ...editingTask,
                                        description: e.target.value,
                                    })
                                }
                                rows={3}
                                maxLength={2000}
                                className="w-full resize-none rounded-xl border border-[#E6D5DE] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B58A94] focus:ring-4 focus:ring-[#B58A94]/15"
                                placeholder="Add some details..."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-[#67485F]">
                                    Category
                                </label>
                                <select
                                    value={editingTask.category || 'Personal'}
                                    onChange={e =>
                                        setEditingTask({
                                            ...editingTask,
                                            category: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-[#E6D5DE] bg-white px-4 py-3 text-sm outline-none focus:border-[#B58A94] focus:ring-4 focus:ring-[#B58A94]/15"
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Study">Study</option>
                                    <option value="Learning">Learning</option>
                                    <option value="Work">Work</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-[#67485F]">
                                    Priority
                                </label>
                                <select
                                    value={editingTask.priority || 'Medium'}
                                    onChange={e =>
                                        setEditingTask({
                                            ...editingTask,
                                            priority: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-[#E6D5DE] bg-white px-4 py-3 text-sm outline-none focus:border-[#B58A94] focus:ring-4 focus:ring-[#B58A94]/15"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#67485F]">
                                Due date
                            </label>
                            <input
                                type="date"
                                value={editingTask.date || ''}
                                onChange={e =>
                                    setEditingTask({
                                        ...editingTask,
                                        date: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-[#E6D5DE] bg-white px-4 py-3 text-sm outline-none focus:border-[#B58A94] focus:ring-4 focus:ring-[#B58A94]/15"
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-[#F0E6EC] pt-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setEditingTask(null)
                                    setActionError('')
                                }}
                                className="rounded-xl border border-[#E6D5DE] px-5 py-3 text-sm font-bold text-[#79566D] transition hover:bg-[#F5EDF2] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving || !editingTask.title?.trim()}
                                className="rounded-xl bg-[#3A0F34] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#3A0F34]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#59264E] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? 'Saving changes...' : 'Save changes →'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Favorites
