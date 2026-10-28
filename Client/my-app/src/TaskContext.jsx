import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

const TaskContext = createContext(null);

const API_URL = 'http://localhost:5000/api/tasks';
const AUTH_CHANGE_EVENT = 'notenest-auth-changed';

// Add the logged-in user's JWT to every request.
function getAuthHeaders(includeJson = false) {
    const token = sessionStorage.getItem('token');

    return {
        ...(includeJson && {
            'Content-Type': 'application/json',
        }),
        ...(token && {
            Authorization: `Bearer ${token}`,
        }),
    };
}

// MongoDB uses _id; keep id for existing React components.
function normalizeTask(task) {
    return {
        ...task,
        id: task._id || task.id,
    };
}

async function getErrorMessage(response, fallback) {
    const data = await response.json().catch(() => ({}));
    return data.message || fallback;
}

function handleUnauthorized() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    window.dispatchEvent(
        new Event(AUTH_CHANGE_EVENT)
    );

    window.location.href = '/Login';
}


export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch only the logged-in user's tasks.

    useEffect(() => {
        let requestId = 0;

        async function fetchTasks() {
            const currentRequest = ++requestId;
            const token = sessionStorage.getItem('token');

            // Clear tasks belonging to the previous account immediately.
            setTasks([]);
            setError('');

            if (!token) {
                setError('Please log in to view your tasks.');
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(API_URL, {
                    headers: getAuthHeaders(),
                });


                if (currentRequest !== requestId) return;

                if (!response.ok) {
                    if (response.status === 401) {
                        handleUnauthorized();

                        throw new Error(
                            'Your session has expired. Please log in again.'
                        );
                    }

                    throw new Error(
                        await getErrorMessage(
                            response,
                            'Could not fetch tasks.'
                        )
                    );
                }


                const data = await response.json();

                // Ignore results from an older account's request.
                if (currentRequest !== requestId) return;

                setTasks(data.map(normalizeTask));
                setError('');
            } catch (err) {
                if (currentRequest !== requestId) return;

                setTasks([]);
                setError(err.message);
                console.error('Fetch tasks failed:', err);
            } finally {
                if (currentRequest === requestId) {
                    setLoading(false);
                }
            }
        }

        fetchTasks();

        window.addEventListener(AUTH_CHANGE_EVENT, fetchTasks);

        return () => {
            requestId++;
            window.removeEventListener(
                AUTH_CHANGE_EVENT,
                fetchTasks
            );
        };
    }, []);


    // Add a task.
    async function addTask(task) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(true),
            body: JSON.stringify({
                ...task,
                done: false,
                favorite: false,
            }),
        });


        if (!response.ok) {
            if (response.status === 401) {
                handleUnauthorized();
                throw new Error(
                    'Your session has expired. Please log in again.'
                );
            }

            throw new Error(
                await getErrorMessage(
                    response,
                    'Could not add task.'
                )
            );
        }


        const savedTask = normalizeTask(await response.json());

        setTasks(previous => [...previous, savedTask]);

        return savedTask;
    }

    // Edit a task.
    async function editTask(id, updatedTask) {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(id)}`,
            {
                method: 'PUT',
                headers: getAuthHeaders(true),
                body: JSON.stringify(updatedTask),
            }
        );


        if (!response.ok) {
            if (response.status === 401) {
                handleUnauthorized();
                throw new Error(
                    'Your session has expired. Please log in again.'
                );
            }

            throw new Error(
                await getErrorMessage(
                    response,
                    'Could not update task.'
                )
            );
        }


        const savedTask = normalizeTask(await response.json());

        setTasks(previous =>
            previous.map(task =>
                task.id === id ? savedTask : task
            )
        );

        return savedTask;
    }

    // Delete a task.
    async function deleteTask(id) {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(id)}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }
        );


        if (!response.ok) {
            if (response.status === 401) {
                handleUnauthorized();
                throw new Error(
                    'Your session has expired. Please log in again.'
                );
            }

            throw new Error(
                await getErrorMessage(
                    response,
                    'Could not delete task.'
                )
            );
        }


        setTasks(previous =>
            previous.filter(task => task.id !== id)
        );
    }

    // Toggle completion.
    async function toggleTask(id) {
        const task = tasks.find(item => item.id === id);

        if (!task) return;

        return editTask(id, {
            done: !task.done,
        });
    }

    // Toggle favorites.
    async function toggleFavorite(id) {
        const task = tasks.find(item => item.id === id);

        if (!task) return;

        return editTask(id, {
            favorite: !task.favorite,
        });
    }

    return (
        <TaskContext.Provider
            value={{
                tasks,
                loading,
                error,
                addTask,
                editTask,
                deleteTask,
                toggleTask,
                toggleFavorite,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);

    if (!context) {
        throw new Error(
            'useTasks must be used inside TaskProvider'
        );
    }

    return context;
}