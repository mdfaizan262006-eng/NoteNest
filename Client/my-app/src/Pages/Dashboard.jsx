
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../TaskContext';
import NotebookBg from '../Components/NotebookBg';

const emptyForm = {
  title: '',
  description: '',
  category: 'Personal',
  date: '',
  priority: 'Medium',
};

const Dashboard = () => {
  const {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    toggleFavorite,
  } = useTasks();

  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);

  const completed = tasks.filter(task => task.done).length;
  const pending = tasks.length - completed;
  const favorites = tasks.filter(task => task.favorite).length;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const visibleTasks = tasks.filter(task => {
    if (filter === 'Completed') return task.done;
    if (filter === 'Pending') return !task.done;
    return true;
  });

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setActionError('');
    setShowModal(true);
  }

  function openEditModal(task) {
    setEditingId(task.id);
    setActionError('');

    setForm({
      title: task.title,
      description: task.description || '',
      category: task.category || 'Personal',
      date: task.date || '',
      priority: task.priority || 'Medium',
    });

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setActionError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const title = form.title.trim();
    if (!title) return;

    const taskDetails = {
      title,
      description: form.description.trim(),
      category: form.category,
      date: form.date,
      priority: form.priority,
    };

    setActionError('');
    setSaving(true);

    try {
      if (editingId !== null) {
        await editTask(editingId, taskDetails);
      } else {
        await addTask(taskDetails);
      }

      closeModal();
    } catch (err) {
      setActionError(
        err.message || 'Could not save your task. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) return;

    setActionError('');

    try {
      await deleteTask(id);
    } catch (err) {
      setActionError(
        err.message || 'Could not delete the task. Please try again.'
      );
    }
  }

  function formatDate(date) {
    if (!date) return '';

    return new Date(date + 'T12:00:00').toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  const priorityStyles = {
    High: 'bg-[#FBE5E0] text-[#A33E2F] ring-1 ring-[#C76545]/20',
    Medium: 'bg-[#F3E4E9] text-[#7A405A] ring-1 ring-[#B58A94]/20',
    Low: 'bg-[#E8F0E9] text-[#315D43] ring-1 ring-[#315D43]/10',
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#F8F3F5] text-[#3A0F34]">
      <NotebookBg />
      <main className="relative z-10 min-w-0 p-5 pt-8 sm:p-8 lg:p-10">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#967784]">
              YOUR WORKSPACE
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Good to see you again.
            </h2>

            <p className="mt-2 text-sm text-[#806E7A]">
              Let's make today a productive one.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3A0F34] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#3A0F34]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#51204A] hover:shadow-lg"
          >
            <span className="text-xl">+</span>
            Add Task
          </button>
        </header>

        {/* Welcome banner */}
        <section className="relative mt-8 overflow-hidden rounded-3xl border border-[#B58A94]/35 bg-linear-to-br from-[#E8D5DB] via-[#F0E2E5] to-[#F8E8DF] p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-24 border-white/25" />
          <div className="pointer-events-none absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-[#C76545]/10 blur-2xl" />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A405A]">
              YOUR DAILY SPACE
            </p>

            <h3 className="mt-3 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
              Make room for what matters.
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#70515F]">
              One task at a time. You've got this.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-5 rounded-xl bg-[#3A0F34] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#51204A]"
            >
              + Create a task
            </button>
          </div>
        </section>

        {/* Summary cards */}
        <section className="mt-7 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[
            {
              title: 'Total Tasks',
              value: tasks.length,
              description: 'In your workspace',
              mark: '▤',
              accent: 'bg-[#F0E2E5] text-[#7A405A]',
            },
            {
              title: 'Completed',
              value: completed,
              description: 'Keep it going!',
              mark: '✓',
              accent: 'bg-[#E8F0E9] text-[#315D43]',
            },
            {
              title: 'Remaining',
              value: pending,
              description: 'Ready when you are',
              mark: '◷',
              accent: 'bg-[#FBE5E0] text-[#A33E2F]',
            },
            {
              title: 'Favorites',
              value: favorites,
              description: 'Your important tasks',
              mark: '★',
              accent: 'bg-[#F3E4E9] text-[#7A405A]',
            },
          ].map(item => (
            <div
              key={item.title}
              className="group rounded-2xl border border-[#B58A94]/25 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B58A94]/60 hover:shadow-lg hover:shadow-[#3A0F34]/5 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-[#806E7A]">
                  {item.title}
                </p>

                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110 ${item.accent}`}>
                  {item.mark}
                </span>
              </div>

              <p className="mt-4 text-3xl font-bold tracking-tight">
                {item.value}
              </p>

              <p className="mt-2 text-xs text-[#967784]">
                {item.description}
              </p>
            </div>
          ))}
        </section>

        {/* Tasks and progress */}
        <div className="mt-8 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">

          {/* Task list */}
          <section className="min-w-0 rounded-2xl border border-[#B58A94]/25 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  All Tasks
                </h3>

                <p className="mt-1 text-sm text-[#806E7A]">
                  Everything you need to get done.
                </p>
              </div>

              <span className="rounded-full bg-[#F3E4E9] px-3 py-1.5 text-xs font-semibold text-[#7A405A]">
                {visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {/* Filters */}
            <div className="mt-5 flex flex-wrap gap-2">
              {['All', 'Pending', 'Completed'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${filter === option
                    ? 'bg-[#3A0F34] text-white shadow-md shadow-[#3A0F34]/15'
                    : 'bg-[#F8F4F6] text-[#6F5969] hover:bg-[#E8D5DB] hover:text-[#3A0F34]'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Loading and errors */}
            {loading && (
              <p className="py-8 text-center text-sm text-[#806E7A]">
                Loading your tasks...
              </p>
            )}

            {!loading && error && (
              <p role="alert" className="my-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {actionError && !showModal && (
              <p role="alert" className="my-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {actionError}
              </p>
            )}

            {/* Task cards */}
            <div className="mt-4 divide-y divide-[#F0E6EB]">
              {visibleTasks.map(task => (
                <div
                  key={task.id}
                  className="group flex items-start gap-3 rounded-xl px-2 py-5 transition-colors duration-200 hover:bg-[#FCF8FA] sm:gap-4"
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} as ${task.done ? 'pending' : 'completed'}`}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#3A0F34]"
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className={`wrap-break-word font-semibold transition-colors ${task.done
                        ? 'text-[#A3939D] line-through'
                        : 'text-[#3A0F34]'
                        }`}
                    >
                      {task.title}
                    </p>

                    {task.description && (
                      <p className="mt-1 wrap-break-word text-sm leading-5 text-[#806E7A]">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#806E7A]">
                      <span className="rounded-md bg-[#F5EDF1] px-2 py-1">
                        {task.category}
                      </span>

                      {task.date && (
                        <span>Due: {formatDate(task.date)}</span>
                      )}
                    </div>
                  </div>

                  {/* Task actions */}
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(task.id)}
                      aria-label={task.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      title={task.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      className={`text-xl transition-all duration-200 hover:scale-125 ${task.favorite
                        ? 'text-[#C76545]'
                        : 'text-[#CBBCC5] hover:text-[#C76545]'
                        }`}
                    >
                      {task.favorite ? '★' : '☆'}
                    </button>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.Medium
                        }`}
                    >
                      {task.priority || 'Medium'}
                    </span>

                    <button
                      type="button"
                      onClick={() => openEditModal(task)}
                      className="rounded-lg bg-[#F0E2E5] px-3 py-2 text-sm font-medium text-[#6F304F] transition-all duration-200 hover:bg-[#E3C7D0] hover:shadow-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="rounded-lg bg-[#FBE5E0] px-3 py-2 text-sm font-medium text-[#A33E2F] transition-all duration-200 hover:bg-[#F4CDC3] hover:shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {!loading && !error && visibleTasks.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E4E9] text-2xl text-[#7A405A]">
                    ✓
                  </div>

                  <p className="mt-4 font-semibold text-[#3A0F34]">
                    Nothing on your list
                  </p>

                  <p className="mt-1 text-sm text-[#806E7A]">
                    No tasks here yet. Enjoy the breathing room!
                  </p>

                  {filter === 'All' && (
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="mt-4 rounded-xl bg-[#3A0F34] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#51204A]"
                    >
                      Create your first task
                    </button>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/Dashboard/Alltasks"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#7A405A] transition hover:gap-2 hover:text-[#3A0F34]"
            >
              View all tasks <span>→</span>
            </Link>
          </section>

          {/* Progress and reminder */}
          <div className="flex flex-col gap-6">

            {/* Progress card */}
            <aside className="relative overflow-hidden rounded-2xl border border-[#B58A94]/25 bg-linear-to-br from-white to-[#F0E2E5] p-6 shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#B58A94]/15 blur-2xl" />

              <div className="relative">
                <p className="text-xs font-bold tracking-[0.15em] text-[#967784]">
                  YOUR PROGRESS
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Today's focus
                </h3>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {progress}%
                  </span>

                  <span className="pb-1 text-sm text-[#806E7A]">
                    completed
                  </span>
                </div>

                <div
                  className="mt-4 h-2.5 overflow-hidden rounded-full bg-white"
                  role="progressbar"
                  aria-label="Task completion progress"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#7A405A] to-[#C76545] transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-4 text-sm leading-6 text-[#806E7A]">
                  {pending === 0
                    ? 'Everything is done. Great work!'
                    : `You have ${pending} task${pending === 1 ? '' : 's'} left. Keep your focus on one at a time.`}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#B58A94]/25 pt-4 text-sm">
                  <span className="text-[#806E7A]">Completed</span>
                  <span className="font-semibold text-[#3A0F34]">
                    {completed} / {tasks.length}
                  </span>
                </div>
              </div>
            </aside>

            {/* Favorites card */}
            <Link
              to="/Dashboard/Favorites"
              className="group relative block overflow-hidden rounded-2xl border border-[#B58A94]/30 bg-[#E8D5DB] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#DFC4CE] hover:shadow-lg hover:shadow-[#3A0F34]/5"
            >
              <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full border-14 border-white/30 transition-transform duration-500 group-hover:scale-110" />

              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">☆ Your Favorites</p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-lg text-[#C76545]">
                    ★
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#70515F]">
                  You have {favorites} favorite task{favorites === 1 ? '' : 's'}. Open your saved tasks.
                </p>

                <p className="mt-3 text-sm font-semibold text-[#3A0F34]">
                  Explore favorites →
                </p>
              </div>
            </Link>

            {/* Reminder card */}
            <div className="rounded-2xl border border-[#B58A94]/25 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">

                <p className="font-bold">A small reminder</p>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#806E7A]">
                You figure out what works after you start moving, not while planning inside your head.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-[#967784]">
          Made for your thoughts. Built for your day.
        </footer>
      </main>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-[#241020]/55 p-4 backdrop-blur-sm"
          onMouseDown={e => {
            if (e.target === e.currentTarget && !saving) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="my-auto w-full max-w-lg rounded-3xl border border-[#B58A94]/30 bg-[#FFFCFD] p-5 shadow-2xl shadow-[#241020]/20 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A05D75]">
                  YOUR WORKSPACE
                </p>

                <h2
                  id="task-modal-title"
                  className="mt-2 text-2xl font-bold"
                >
                  {editingId !== null ? 'Edit task' : 'Create a new task'}
                </h2>

                <p className="mt-1 text-sm text-[#806E7A]">
                  {editingId !== null
                    ? 'Update the details of your task.'
                    : 'Add the details and make a plan.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                className="rounded-xl px-3 py-1 text-2xl text-[#806E7A] transition hover:bg-[#F0E2E5] hover:text-[#3A0F34]"
              >
                ×
              </button>
            </div>

            {actionError && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {actionError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="task-title"
                  className="mb-2 block text-sm font-semibold text-[#3A0F34]"
                >
                  Task title *
                </label>

                <input
                  id="task-title"
                  type="text"
                  required
                  maxLength={100}
                  autoFocus
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Complete React project"
                  className="w-full rounded-xl border border-[#DCCAD2] bg-white px-4 py-3 text-[#3A0F34] outline-none transition placeholder:text-[#B5A3AD] focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="task-description"
                  className="mb-2 block text-sm font-semibold text-[#3A0F34]"
                >
                  Description
                </label>

                <textarea
                  id="task-description"
                  rows={3}
                  maxLength={500}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="What needs to be done?"
                  className="w-full resize-y rounded-xl border border-[#DCCAD2] bg-white px-4 py-3 text-[#3A0F34] outline-none transition placeholder:text-[#B5A3AD] focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="task-category"
                    className="mb-2 block text-sm font-semibold text-[#3A0F34]"
                  >
                    Category
                  </label>

                  <select
                    id="task-category"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-[#DCCAD2] bg-white px-3 py-3 text-[#3A0F34] outline-none transition focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                    <option value="Learning">Learning</option>
                    <option value="Work">Work</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="task-priority"
                    className="mb-2 block text-sm font-semibold text-[#3A0F34]"
                  >
                    Task difficulty
                  </label>

                  <select
                    id="task-priority"
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full rounded-xl border border-[#DCCAD2] bg-white px-3 py-3 text-[#3A0F34] outline-none transition focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                  >
                    <option value="Low">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="High">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="task-date"
                  className="mb-2 block text-sm font-semibold text-[#3A0F34]"
                >
                  Due date
                </label>

                <input
                  id="task-date"
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full min-w-0 rounded-xl border border-[#DCCAD2] bg-white px-3 py-3 text-[#3A0F34] outline-none transition focus:border-[#7A405A] focus:ring-4 focus:ring-[#B58A94]/15"
                />
              </div>

              <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#DCCAD2] px-5 py-3 text-sm font-semibold text-[#6F5969] transition hover:bg-[#F5EDF1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#3A0F34] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#3A0F34]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#51204A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                      ? 'Save Changes'
                      : '+ Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
