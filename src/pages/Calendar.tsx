import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock, User, CheckSquare, Users } from 'lucide-react';
import { useAuth, useData } from '@/contexts';
import api, { ProjectDTO, TaskDTO } from '@/lib/api';

const Calendar = () => {
    const { token } = useAuth();
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<{ type: 'project' | 'task', data: ProjectDTO | TaskDTO } | null>(null);
    const { users } = useData();

    useEffect(() => {
        let mounted = true;
        const load = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await api.calendar.list(token);
            if (!mounted) return;
            setProjects(res.projects || []);
            setTasks(res.tasks || []);
        } catch (err) {
            console.error('Failed to load calendar', err);
            if (mounted) setError('Failed to load calendar');
        } finally {
            if (mounted) setLoading(false);
        }
    };
    load();
    return () => {
        mounted = false;
    };
    }, [token]);

    const isSameDay = (d1?: string | Date | null, d2?: Date) => {
        if (!d1 || !d2) return false;
        const dd1 = new Date(d1);
        return (
        dd1.getFullYear() === d2.getFullYear() &&
        dd1.getMonth() === d2.getMonth() &&
        dd1.getDate() === d2.getDate()
        );
    };

  // Helpers to normalize ids and statuses from backend DTOs
    const getId = (v?: unknown): string | undefined => {
        if (!v) return undefined;
        if (typeof v === 'string') return v;
        if (typeof v === 'object' && v !== null) {
        const obj = v as Record<string, unknown>;
        return (obj._id as string) || (obj.id as string);
        }
        return undefined;
    };

    const statusLabel = (s?: string) => (s ? s.replace(/[-_]/g, ' ').toUpperCase() : '');
    const isStatusDone = (s?: string) => s === 'done' || s === 'completed';
    const isStatusInProgress = (s?: string) => !!s && (s.includes('in-progress') || s.includes('in_progress'));

    const eventsOnDate = (date: Date) => {
        const p = projects
        .filter((proj) => isSameDay(proj.startDate, date) || isSameDay(proj.endDate, date))
        .map((proj) => ({ 
            type: 'project' as const, 
            title: proj.name, 
            isStart: isSameDay(proj.startDate, date),
            isEnd: isSameDay(proj.endDate, date),
            data: proj
        }));
        const t = tasks
        .filter((task) => isSameDay(task.dueDate, date))
        .map((task) => ({ type: 'task' as const, title: task.title, data: task }));
        return [...p, ...t];
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days: (Date | null)[] = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
        }
        
        // Add all days in month
        for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
        }
        
        return days;
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return isSameDay(date, today);
    };

    const days = getDaysInMonth(currentDate);

    return (
        <div className="h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-normal text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <div className="flex items-center gap-2">
                <button
                onClick={goToToday}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                Today
                </button>
                <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded"
                >
                <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded"
                >
                <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            </div>

            {loading && <div className="text-sm text-gray-500">Loading calendar...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
            <div className="h-full flex flex-col">
            {/* Week day headers */}
            <div className="grid grid-cols-7 border-b bg-white sticky top-0 z-10">
                {weekDays.map((day) => (
                <div key={day} className="px-2 py-2 text-xs font-medium text-gray-600 text-center border-r last:border-r-0">
                    {day}
                </div>
                ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: '1fr' }}>
                {days.map((day, idx) => {
                const events = day ? eventsOnDate(day) : [];
                const isCurrentDay = isToday(day);
                const isSelected = day && selectedDate && isSameDay(day, selectedDate);

                return (
                    <div
                    key={idx}
                    className={`border-r border-b last:border-r-0 p-2 min-h-[120px] ${
                        day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                    } ${isSelected ? 'bg-blue-50' : ''}`}
                    onClick={() => day && setSelectedDate(day)}
                    >
                    {day && (
                        <>
                        <div className="flex justify-between items-start mb-1">
                            <span
                            className={`text-sm ${
                                isCurrentDay
                                ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-medium'
                                : 'text-gray-700'
                            }`}
                            >
                            {day.getDate()}
                            </span>
                        </div>
                        <div className="space-y-1">
                            {events.slice(0, 3).map((event, eventIdx) => (
                            <div
                                key={eventIdx}
                                className={`text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 ${
                                event.type === 'project'
                                    ? 'bg-blue-100 text-blue-800 border-l-2 border-blue-600'
                                    : 'bg-amber-100 text-amber-800 border-l-2 border-amber-600'
                                }`}
                                title={event.title}
                                onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent({ type: event.type, data: event.data });
                                }}
                            >
                                {event.title}
                            </div>
                            ))}
                            {events.length > 3 && (
                            <div className="text-xs text-gray-500 px-2">
                                +{events.length - 3} more
                            </div>
                            )}
                        </div>
                        </>
                    )}
                    </div>
                );
                })}
            </div>
            </div>
        </div>

        {/* Side panel for selected date */}
        {selectedDate && (
            <div className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-lg overflow-y-auto">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                    {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                    })}
                </h2>
                <button
                    onClick={() => setSelectedDate(null)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
                </div>

                <div className="space-y-3">
                {eventsOnDate(selectedDate).length > 0 ? (
                    eventsOnDate(selectedDate).map((event, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                        event.type === 'project'
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-amber-50 border-amber-500'
                        }`}
                        onClick={() => setSelectedEvent({ type: event.type, data: event.data })}
                    >
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-gray-600 mt-1 capitalize">
                        {event.type}
                        {event.type === 'project' && 'isStart' in event && (
                            <span className="ml-2">
                            {event.isStart && '(Start)'}
                            {event.isEnd && '(End)'}
                            </span>
                        )}
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-sm">No events for this day</div>
                )}
                </div>
            </div>
            </div>
        )}

        {/* Event Detail Popup */}
        {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <div className={`p-4 rounded-t-lg ${selectedEvent.type === 'project' ? 'bg-blue-500' : 'bg-amber-500'}`}>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-white">
                    {selectedEvent.type === 'project' 
                        ? (selectedEvent.data as ProjectDTO).name 
                        : (selectedEvent.data as TaskDTO).title}
                    </h3>
                    <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
                    >
                    <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-white text-sm mt-1 opacity-90 capitalize">
                    {selectedEvent.type}
                </div>
                </div>

                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {selectedEvent.type === 'project' ? (
                    <>
                    {(selectedEvent.data as ProjectDTO).description && (
                        <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Description</div>
                        <div className="text-gray-800">{(selectedEvent.data as ProjectDTO).description}</div>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-700">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <div className="text-sm">
                        <span className="font-medium">Start:</span>{' '}
                        {(selectedEvent.data as ProjectDTO).startDate 
                            ? new Date((selectedEvent.data as ProjectDTO).startDate!).toLocaleDateString()
                            : 'Not set'}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <div className="text-sm">
                        <span className="font-medium">End:</span>{' '}
                        {(selectedEvent.data as ProjectDTO).endDate 
                            ? new Date((selectedEvent.data as ProjectDTO).endDate!).toLocaleDateString()
                            : 'Not set'}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        (selectedEvent.data as ProjectDTO).status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : (selectedEvent.data as ProjectDTO).status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {(selectedEvent.data as ProjectDTO).status?.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>

                    {/* Tasks in Project */}
                    <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                        <CheckSquare className="w-4 h-4" />
                        Tasks ({tasks.filter(t => getId(t.projectId) === getId((selectedEvent.data as ProjectDTO)._id)).length})
                        </div>
                        {tasks.filter(t => getId(t.projectId) === getId((selectedEvent.data as ProjectDTO)._id)).length > 0 ? (
                        <div className="space-y-2">
                            {tasks.filter(t => getId(t.projectId) === getId((selectedEvent.data as ProjectDTO)._id)).map((task) => (
                            <div key={getId(task._id) || Math.random()} className="bg-gray-50 rounded p-3 border border-gray-200">
                                <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <div className="font-medium text-sm">{task.title}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                    {task.dueDate && (
                                        <span className="text-xs text-gray-500">
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                    {task.priority && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                                        task.priority === 'high'
                                            ? 'bg-red-100 text-red-700'
                                            : task.priority === 'medium'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {task.priority}
                                        </span>
                                    )}
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                                    isStatusDone(task.status)
                                    ? 'bg-green-100 text-green-700'
                                    : isStatusInProgress(task.status)
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {statusLabel(task.status) || ''}
                                </span>
                                </div>
                                {task.assigneeIds && task.assigneeIds.length > 0 && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                                    <User className="w-3 h-3" />
                                    <span>Assigned to: {Array.isArray(task.assigneeIds) ? (task.assigneeIds.map(a => users.find(u => u.id === getId(a))?.name || getId(a)).join(', ')) : (users.find(u => u.id === getId(task.assigneeIds))?.name || getId(task.assigneeIds))}</span>
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        ) : (
                        <div className="text-sm text-gray-500 italic">No tasks in this project</div>
                        )}
                    </div>
                    </>
                ) : (
                    <>
                    {(selectedEvent.data as TaskDTO).description && (
                        <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Description</div>
                        <div className="text-gray-800">{(selectedEvent.data as TaskDTO).description}</div>
                        </div>
                    )}

                    {/* Assigned To */}
                    {(selectedEvent.data as TaskDTO).assigneeIds && (selectedEvent.data as TaskDTO).assigneeIds.length > 0 && (
                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded">
                        <User className="w-4 h-4 text-gray-500" />
                        <div className="text-sm">
                            <span className="font-medium">Assigned to:</span>{' '}
                            {Array.isArray((selectedEvent.data as TaskDTO).assigneeIds)
                            ? ((selectedEvent.data as TaskDTO).assigneeIds.map(a => users.find(u => u.id === getId(a))?.name || getId(a)).join(', '))
                            : (users.find(u => u.id === getId((selectedEvent.data as TaskDTO).assigneeIds))?.name || getId((selectedEvent.data as TaskDTO).assigneeIds))}
                        </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div className="text-sm">
                        <span className="font-medium">Due Date:</span>{' '}
                        {(selectedEvent.data as TaskDTO).dueDate 
                            ? new Date((selectedEvent.data as TaskDTO).dueDate!).toLocaleDateString()
                            : 'Not set'}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Priority</div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        (selectedEvent.data as TaskDTO).priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : (selectedEvent.data as TaskDTO).priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {(selectedEvent.data as TaskDTO).priority?.toUpperCase() || 'NORMAL'}
                        </span>
                    </div>

                    <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        (selectedEvent.data as TaskDTO).status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : (selectedEvent.data as TaskDTO).status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {(selectedEvent.data as TaskDTO).status?.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>

                    {/* Project Info if task belongs to a project */}
                    {(selectedEvent.data as TaskDTO).projectId && (
                        <div className="pt-2 border-t">
                        <div className="text-sm font-medium text-gray-600 mb-1">Project</div>
                        <div className="text-sm text-gray-800">
                            {projects.find(p => getId(p._id) === getId((selectedEvent.data as TaskDTO).projectId))?.name || 'Unknown Project'}
                        </div>
                        </div>
                    )}
                    </>
                )}
                </div>

                <div className="border-t p-4 flex justify-end">
                <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
                >
                    Close
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default Calendar;