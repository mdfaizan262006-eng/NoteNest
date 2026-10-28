
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../TaskContext';
import NotebookBg from '../Components/NotebookBg';

const Alltasks = () => {
    const {
        tasks,
        editTask,
        deleteTask,
        toggleTask,
        toggleFavorite,
    } = useTasks();

    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [saving, setSaving] = useState(false);
    const [actionError, setActionError] = useState('');

    const completedCount = tasks.filter(task => task.done).length;
    const pendingCount = tasks.length - completedCount;
    const favoriteCount = tasks.filter(task => task.favorite).length;

    const filteredTasks = useMemo(() => {
        const query = search.trim().toLowerCase();

        return tasks.filter(task => {
            const matchesSearch =
                (task.title || '').toLowerCase().includes(query) ||
                (task.description || '').toLowerCase().includes(query);

            const matchesFilter =
                filter === 'All' ||
                (filter === 'Pending' && !task.done) ||
                (filter === 'Completed' && task.done);

            return matchesSearch && matchesFilter;
        });
    }, [tasks, filter, search]);

    const priorityStyles = {
        High: 'bg-[#FBE5E0] text-[#A33E2F] ring-[#C76545]/20',
        Medium: 'bg-[#F3E4E9] text-[#7A405A] ring-[#B58A94]/30',
        Low: 'bg-[#E8F0E9] text-[#315D43] ring-[#315D43]/15',
    };

    function formatDate(date) {
        if (!date) return 'Not set';

        // Preserve support for date-only values from the existing API.
        const parsedDate = new Date(`${date}T12:00:00`);

        if (Number.isNaN(parsedDate.getTime())) return date;

        return parsedDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setActionError('');

        try {
            await deleteTask(id);
        } catch (err) {
            setActionError(
                err.message || 'Could not delete the task. Please try again.'
            );
        }
    }

    function openEdit(task) {
        setActionError('');

        setEditingTask({
            ...task,
            category: task.category || 'Personal',
            priority: task.priority || 'Medium',
            date: task.date || '',
            description: task.description || '',
        });
    }

    async function handleSave(e) {
        e.preventDefault();

        if (!editingTask?.title.trim() || saving) return;

        const { id, ...updatedTask } = editingTask;

        setSaving(true);
        setActionError('');

        try {
            await editTask(id, {
                ...updatedTask,
                title: updatedTask.title.trim(),
                description: (updatedTask.description || '').trim(),
            });

            setEditingTask(null);
        } catch (err) {
            setActionError(
                err.message || 'Could not save your changes. Please try again.'
            );
        } finally {
            setSaving(false);
        }
    }

    const statCards = [
        {
            label: 'Total Tasks',
            value: tasks.length,
            note: 'Everything in one place',
            symbol: '▤',
            color: 'bg-[#F0E2E5] text-[#7A405A]',
            glow: 'group-hover:shadow-[#B58A94]/15',
        },
        {
            label: 'Pending',
            value: pendingCount,
            note: 'Still on your list',
            symbol: '◷',
            color: 'bg-[#FBE5E0] text-[#A33E2F]',
            glow: 'group-hover:shadow-[#C76545]/10',
        },
        {
            label: 'Completed',
            value: completedCount,
            note: 'Look how far you have come',
            symbol: '✓',
            color: 'bg-[#E8F0E9] text-[#315D43]',
            glow: 'group-hover:shadow-[#315D43]/10',
        },
    ];

    return (
        <div className="relative isolate min-h-screen bg-[#F8F3F5] text-[#3A0F34]">
            <NotebookBg />

            <main className="relative z-10 mx-auto max-w-7xl p-4 sm:p-7 lg:p-10">

                {/* Header */}
                <header className="mb-8 flex flex-wrap items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3A0F34] text-xl text-white shadow-lg shadow-[#3A0F34]/20 transition-transform duration-300 hover:-rotate-6 hover:scale-105">
                            <span>▤</span>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#A05D75]">
                                YOUR WORKSPACE
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                                All Tasks<span className="text-[#C76545]">.</span>
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-6 text-[#806E7A]">
                                One space for every plan, priority, and little win.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/Dashboard"
                        className="group inline-flex items-center gap-2 rounded-xl border border-[#B58A94]/35 bg-white/80 px-4 py-3 text-sm font-semibold text-[#3A0F34] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B58A94] hover:bg-white hover:shadow-md"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>
                        Dashboard
                    </Link>
                </header>

                {/* Intro banner */}
                <section className="relative mb-7 overflow-hidden rounded-[28px] border border-white/70 bg-linear-to-br from-[#E8D5DB] via-[#F0E2E5] to-[#F8E8DF] p-6 shadow-sm sm:p-8 lg:p-9">
                    <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-32 border-white/20" />
                    <div className="pointer-events-none absolute -bottom-24 right-36 h-52 w-52 rounded-full bg-[#C76545]/10 blur-2xl" />
                    <div className="pointer-events-none absolute right-12 top-10 hidden h-3 w-3 rounded-full bg-[#C76545]/60 sm:block" />
                    <div className="pointer-events-none absolute right-36 top-24 hidden h-2 w-2 rounded-full bg-[#7A405A]/40 sm:block" />

                    <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#7A405A] backdrop-blur">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#C76545]" />
                                Plan · Focus · Finish
                            </span>

                            <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                                Progress begins with
                                <span className="text-[#A65343]"> one task.</span>
                            </h2>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-[#70515F] sm:text-base">
                                Find what matters, clear what is done, and keep moving at your own pace.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3A0F34] text-lg text-white">
                                ✦
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{completedCount}/{tasks.length}</p>
                                <p className="text-xs text-[#806E7A]">Tasks completed</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {statCards.map((item, index) => (
                        <article
                            key={item.label}
                            className={`group relative overflow-hidden rounded-2xl border border-[#B58A94]/20 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B58A94]/50 hover:shadow-xl ${item.glow}`}
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#F0E2E5]/45 transition-transform duration-500 group-hover:scale-150" />

                            <div className="relative flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-[#806E7A]">
                                        {item.label}
                                    </p>

                                    <p className="mt-3 text-4xl font-bold tracking-tight">
                                        {item.value}
                                    </p>

                                    <p className="mt-2 text-xs text-[#967784]">
                                        {item.note}
                                    </p>
                                </div>

                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${item.color}`}>
                                    {item.symbol}
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                {/* Search and filters */}
                <section className="mb-7 rounded-2xl border border-[#B58A94]/20 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative min-w-0 flex-1">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#A05D75]">
                                ⌕
                            </span>

                            <input
                                type="search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by task title or description..."
                                aria-label="Search tasks"
                                className="w-full rounded-xl border border-[#E3D3DA] bg-[#FCF9FA] py-3.5 pl-11 pr-4 text-sm text-[#3A0F34] outline-none transition-all duration-200 placeholder:text-[#B5A3AD] focus:border-[#7A405A] focus:bg-white focus:ring-4 focus:ring-[#B58A94]/15"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="mr-1 text-xs font-bold uppercase tracking-wider text-[#967784]">
                                Show
                            </span>

                            {['All', 'Pending', 'Completed'].map(option => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setFilter(option)}
                                    aria-pressed={filter === option}
                                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${filter === option
                                        ? 'bg-[#3A0F34] text-white shadow-md shadow-[#3A0F34]/15'
                                        : 'bg-[#F6EDF1] text-[#70515F] hover:bg-[#E8D5DB] hover:text-[#3A0F34]'
                                        }`}
                                >
                                    {option}
                                    {option === 'All' && (
                                        <span className="ml-2 text-xs opacity-70">
                                            {tasks.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0E6EB] pt-4">
                        <p className="text-xs text-[#806E7A]">
                            {search ? (
                                <>
                                    Results for <span className="font-semibold text-[#3A0F34]">"{search}"</span>
                                </>
                            ) : (
                                'Your tasks, organized your way.'
                            )}
                        </p>

                        <p className="text-xs font-semibold text-[#7A405A]">
                            {filteredTasks.length} {filteredTasks.length === 1 ? 'result' : 'results'}
                        </p>
                    </div>
                </section>

                {/* Error feedback */}
                {actionError && (
                    <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {actionError}
                    </p>
                )}

                {/* Task list */}
                {filteredTasks.length === 0 ? (
                    <section className="relative overflow-hidden rounded-[28px] border-2 border-dashed border-[#DCCAD2] bg-white/70 px-5 py-14 text-center sm:py-20">
                        <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[#F0E2E5]/60 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-[#F5DDD4]/40 blur-2xl" />

                        <div className="relative">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#B58A94]/20 bg-linearradient-to-br from-[#F0E2E5] to-[#FBE5E0] text-3xl shadow-sm">
                                {tasks.length === 0 ? '✦' : '⌕'}
                            </div>

                            <h2 className="mt-6 text-xl font-bold sm:text-2xl">
                                {tasks.length === 0
                                    ? 'Your next chapter starts here.'
                                    : 'No matching tasks found.'}
                            </h2>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#806E7A]">
                                {tasks.length === 0
                                    ? 'Create your first task from the Dashboard and turn your plans into progress.'
                                    : 'Try a different search term or change the selected filter to find your tasks.'}
                            </p>

                            {tasks.length === 0 ? (
                                <Link
                                    to="/Dashboard"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3A0F34] px-5 py-3 font-semibold text-white shadow-md shadow-[#3A0F34]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#51204A]"
                                >
                                    Go to Dashboard <span>→</span>
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setFilter('All');
                                    }}
                                    className="mt-6 rounded-xl border border-[#B58A94]/40 bg-white px-5 py-3 font-semibold text-[#3A0F34] transition hover:bg-[#F6EDF1]"
                                >
                                    Clear search and filters
                                </button>
                            )}
                        </div>
                    </section>
                ) : (
                    <section>
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-bold">
                                Your task collection
                            </h2>

                            <span className="text-xs text-[#967784]">
                                Select a task to update its status
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {filteredTasks.map((task, index) => (
                                <article
                                    key={task.id}
                                    className="group relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#B58A94]/20 bg-white/95 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B58A94]/50 hover:shadow-xl hover:shadow-[#3A0F34]/5 sm:p-6"
                                    style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                                >
                                    <div className={`absolute left-0 top-0 h-1 w-full transition-opacity duration-300 ${task.done
                                        ? 'bg-linear-to-r from-[#78977F] to-[#C1D8C5]'
                                        : 'bg-linear-to-r from-[#7A405A] via-[#B58A94] to-[#C76545]'
                                        }`} />

                                    {/* Task title and favorite */}
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(task.done)}
                                            onChange={() => toggleTask(task.id)}
                                            aria-label={`Mark ${task.title} as ${task.done ? 'pending' : 'completed'}`}
                                            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#3A0F34]"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <h3
                                                className={`wrap-break-word text-lg font-bold leading-snug transition-colors ${task.done
                                                    ? 'text-[#A3939D] line-through'
                                                    : 'text-[#3A0F34] group-hover:text-[#7A405A]'
                                                    }`}
                                            >
                                                {task.title}
                                            </h3>

                                            <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-[#806E7A]">
                                                {task.description || 'No description provided.'}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleFavorite(task.id)}
                                            title={task.favorite ? 'Remove from favorites' : 'Add to favorites'}
                                            aria-label={`${task.favorite ? 'Remove' : 'Add'} ${task.title} ${task.favorite ? 'from' : 'to'} favorites`}
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-2xl transition-all duration-200 hover:scale-110 ${task.favorite
                                                ? 'bg-[#FBE5E0] text-[#C76545]'
                                                : 'bg-[#F8F3F5] text-[#CBBCC5] hover:bg-[#FBE5E0] hover:text-[#C76545]'
                                                }`}
                                        >
                                            {task.favorite ? '★' : '☆'}
                                        </button>
                                    </div>

                                    {/* Metadata */}
                                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                                        <span className="rounded-full bg-[#F6EDF1] px-3 py-1.5 font-medium text-[#70515F]">
                                            {task.category || 'Personal'}
                                        </span>

                                        <span
                                            className={`rounded-full px-3 py-1.5 font-semibold ring-1 ${priorityStyles[task.priority] || priorityStyles.Medium
                                                }`}
                                        >
                                            {task.priority || 'Medium'} Priority
                                        </span>

                                        <span
                                            className={`rounded-full px-3 py-1.5 font-semibold ${task.done
                                                ? 'bg-[#E8F0E9] text-[#315D43]'
                                                : 'bg-[#FBE5E0] text-[#A33E2F]'
                                                }`}
                                        >
                                            <span className="mr-1">
                                                {task.done ? '✓' : '◷'}
                                            </span>
                                            {task.done ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>

                                    {/* Due date */}
                                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#FCF8FA] px-3 py-3 text-sm">
                                        <span className="text-[#A05D75]">◷</span>
                                        <span className="text-[#806E7A]">Due date</span>
                                        <span className="ml-auto font-semibold text-[#3A0F34]">
                                            {formatDate(task.date)}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-5 flex flex-wrap gap-3 border-t border-[#F0E6EB] pt-4">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(task)}
                                            className="flex-1 rounded-xl bg-[#3A0F34] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#51204A] hover:shadow-md"
                                        >
                                            Edit task
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(task.id)}
                                            className="rounded-xl border border-[#E8C6C1] bg-[#FFF8F6] px-4 py-2.5 text-sm font-semibold text-[#A33E2F] transition-all duration-200 hover:border-[#C76545]/50 hover:bg-[#FBE5E0]"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[#B58A94]/20 py-6 text-center sm:flex-row sm:text-left">
                    <p className="text-xs text-[#967784]">
                        NoteNest · A little progress goes a long way.
                    </p>

                    <p className="text-xs text-[#967784]">
                        Showing {filteredTasks.length} of {tasks.length} tasks
                    </p>
                </footer>
            </main>

            {/* Edit Task Modal */}
            {editingTask && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-[#241020]/55 p-4 backdrop-blur-sm"
                    onMouseDown={e => {
                        if (e.target === e.currentTarget && !saving) {
                            setEditingTask(null);
                            setActionError('');
                        }
                    }}
                >
                    <form
                        onSubmit={handleSave}
                        className="my-auto w-full max-w-lg space-y-5 rounded-3xl border border-[#B58A94]/30 bg-[#FFFCFD] p-5 shadow-2xl shadow-[#241020]/20 sm:p-7"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A05D75]">
                                    UPDATE YOUR PLAN
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-[#3A0F34]">
                                    Edit Task
                                </h2>

                                <p className="mt-1 text-sm text-[#806E7A]">
                                    Make adjustments and keep moving.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setEditingTask(null);
                                    setActionError('');
                                }}
                                aria-label="Close edit dialog"
                                className="rounded-xl px-3 py-1 text-2xl text-[#806E7A] transition hover:bg-[#F0E2E5] hover:text-[#3A0F34]"
                            >
                                ×
                            </button>
                        </div>

                        {actionError && (
                            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                                {actionError}
                            </p>
                        )}

                        <div>
                            <label htmlFor="edit-title" className="mb-2 block text-sm font-semibold text-[#3A0F34]">
                                Task title *
                            </label>

                            <input
                                id="edit-title"
                                type="text"
                                value={editingTask.title}
                                onChange={e => setEditingTask({
                                    ...editingTask,
                                    title: e.target.value,
                                })}
                                maxLength={100}
                                required
                                className="w-full rounded-xl border border-[#DCCAD2] bg-white px-4 py-3 text-[#3A0F34] outline-none transition placeholder:text-[#B5A3AD] focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                            />
                        </div>

                        <div>
                            <label htmlFor="edit-description" className="mb-2 block text-sm font-semibold text-[#3A0F34]">
                                Description
                            </label>

                            <textarea
                                id="edit-description"
                                value={editingTask.description || ''}
                                onChange={e => setEditingTask({
                                    ...editingTask,
                                    description: e.target.value,
                                })}
                                rows={3}
                                maxLength={500}
                                className="w-full resize-y rounded-xl border border-[#DCCAD2] bg-white px-4 py-3 text-[#3A0F34] outline-none transition focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="edit-category" className="mb-2 block text-sm font-semibold text-[#3A0F34]">
                                    Category
                                </label>

                                <select
                                    id="edit-category"
                                    value={editingTask.category || 'Personal'}
                                    onChange={e => setEditingTask({
                                        ...editingTask,
                                        category: e.target.value,
                                    })}
                                    className="w-full rounded-xl border border-[#DCCAD2] bg-white px-3 py-3 text-[#3A0F34] outline-none transition focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Study">Study</option>
                                    <option value="Learning">Learning</option>
                                    <option value="Work">Work</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="edit-priority" className="mb-2 block text-sm font-semibold text-[#3A0F34]">
                                    Priority
                                </label>

                                <select
                                    id="edit-priority"
                                    value={editingTask.priority || 'Medium'}
                                    onChange={e => setEditingTask({
                                        ...editingTask,
                                        priority: e.target.value,
                                    })}
                                    className="w-full rounded-xl border border-[#DCCAD2] bg-white px-3 py-3 text-[#3A0F34] outline-none transition focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="edit-date" className="mb-2 block text-sm font-semibold text-[#3A0F34]">
                                Due date
                            </label>

                            <input
                                id="edit-date"
                                type="date"
                                value={editingTask.date || ''}
                                onChange={e => setEditingTask({
                                    ...editingTask,
                                    date: e.target.value,
                                })}
                                className="w-full min-w-0 rounded-xl border border-[#DCCAD2] bg-white px-3 py-3 text-[#3A0F34] outline-none transition focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-[#F0E6EB] pt-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setEditingTask(null);
                                    setActionError('');
                                }}
                                className="rounded-xl border border-[#DCCAD2] px-5 py-3 text-sm font-semibold text-[#6F5969] transition hover:bg-[#F5EDF1] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#3A0F34] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#3A0F34]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#51204A] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Alltasks;
