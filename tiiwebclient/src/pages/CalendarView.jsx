import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { Card, Button, Badge, Alert, Row, Col, Dropdown } from 'react-bootstrap';
import './CalendarView.css';

const CalendarView = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        generateCalendarDays();
    }, [currentDate, tasks]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getAll();
            setTasks(data);
            setError('');
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to load tasks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Get first day of the month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Calculate days from previous month to fill the first week
        const daysFromPrevMonth = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Calculate total cells needed (previous month days + current month days + next month days)
        const totalCells = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;

        const days = [];

        // Add days from previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDay - i);
            days.push({
                date,
                isCurrentMonth: false,
                tasks: getTasksForDate(date)
            });
        }

        // Add days from current month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({
                date,
                isCurrentMonth: true,
                tasks: getTasksForDate(date)
            });
        }

        // Add days from next month
        const remainingCells = totalCells - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            const date = new Date(year, month + 1, i);
            days.push({
                date,
                isCurrentMonth: false,
                tasks: getTasksForDate(date)
            });
        }

        setCalendarDays(days);
    };

    const getTasksForDate = (date) => {
        // Check which tasks have a due date on this specific date
        return tasks.filter(task => {
            if (!task.dueDate) return false;

            const dueDate = new Date(task.dueDate);
            return dueDate.getDate() === date.getDate() &&
                dueDate.getMonth() === date.getMonth() &&
                dueDate.getFullYear() === date.getFullYear();
        });
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'ToDo': return 'todo';
            case 'InProgress': return 'in-progress';
            case 'Done': return 'done';
            default: return '';
        }
    };

    const handleDayClick = (day) => {
        if (day.tasks.length > 0) {
            setSelectedTask(day.tasks[0]);
        } else {
            setSelectedTask(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ToDo': return <Badge bg="secondary">To Do</Badge>;
            case 'InProgress': return <Badge bg="primary">In Progress</Badge>;
            case 'Done': return <Badge bg="success">Done</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const formatMonthYear = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="text-center mt-5 pt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading calendar...</span>
                </div>
                <p className="mt-3">Loading calendar...</p>
            </div>
        );
    }

    return (
        <div className="calendar-container fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="calendar-title mb-0">Task Calendar</h1>
                <Link to="/tasks/create">
                    <Button variant="primary" className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create New Task
                    </Button>
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="calendar-card">
                        <Card.Header className="bg-white calendar-header">
                            <Button variant="outline-secondary" onClick={() => navigateMonth(-1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </Button>
                            <h4 className="mb-0">{formatMonthYear(currentDate)}</h4>
                            <Button variant="outline-secondary" onClick={() => navigateMonth(1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </Button>
                        </Card.Header>

                        <Card.Body className="p-0">
                            <div className="calendar-grid">
                                {/* Day labels */}
                                <div className="calendar-day-label">Sun</div>
                                <div className="calendar-day-label">Mon</div>
                                <div className="calendar-day-label">Tue</div>
                                <div className="calendar-day-label">Wed</div>
                                <div className="calendar-day-label">Thu</div>
                                <div className="calendar-day-label">Fri</div>
                                <div className="calendar-day-label">Sat</div>

                                {/* Calendar days */}
                                {calendarDays.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${day.tasks.length > 0 ? 'has-tasks' : ''}`}
                                        onClick={() => handleDayClick(day)}
                                    >
                                        <div className="calendar-date">{day.date.getDate()}</div>
                                        <div className="calendar-tasks">
                                            {day.tasks.slice(0, 2).map((task, taskIndex) => (
                                                <div
                                                    key={taskIndex}
                                                    className={`calendar-task status-${getStatusClass(task.status)}`}
                                                    title={task.title}
                                                >
                                                    {task.title}
                                                </div>
                                            ))}
                                            {day.tasks.length > 2 && (
                                                <div className="calendar-more-tasks">
                                                    +{day.tasks.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="task-preview-card h-100">
                        <Card.Header className="bg-white">
                            <h5 className="mb-0">Selected Task</h5>
                        </Card.Header>
                        <Card.Body>
                            {selectedTask ? (
                                <div className="selected-task">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="task-title mb-1">{selectedTask.title}</h5>
                                        {getStatusBadge(selectedTask.status)}
                                    </div>

                                    <div className="task-description mb-4">
                                        {selectedTask.description || 'No description provided.'}
                                    </div>

                                    <div className="task-details">
                                        <div className="task-detail-item">
                                            <span className="detail-label">Due Date:</span>
                                            <span className="detail-value">
                                                {new Date(selectedTask.dueDate).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="task-detail-item">
                                            <span className="detail-label">Assigned To:</span>
                                            <span className="detail-value">
                                                {selectedTask.assignedToName || 'Unassigned'}
                                            </span>
                                        </div>

                                        <div className="task-detail-item">
                                            <span className="detail-label">Project:</span>
                                            <span className="detail-value">
                                                Project #{selectedTask.projectId}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="task-actions mt-4">
                                        <Link to={`/tasks/${selectedTask.taskId}`} className="btn btn-primary w-100">
                                            View Task Details
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-task-selected">
                                    <div className="empty-state-small">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <p>Select a day with tasks to see details</p>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CalendarView;