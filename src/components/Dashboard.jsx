import React, { useMemo } from 'react';
import { CheckCircle2, Circle, AlertCircle, ListTodo, TrendingUp, Activity } from 'lucide-react';
import '../App.css';

const Dashboard = ({ tasks, lists }) => {
    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        const byPriority = {
            high: tasks.filter(t => t.priority === 'high').length,
            medium: tasks.filter(t => t.priority === 'medium').length,
            low: tasks.filter(t => t.priority === 'low').length,
        };

        const byList = lists.map(list => ({
            name: list.title,
            total: tasks.filter(t => t.listId === list.id).length,
            completed: tasks.filter(t => t.listId === list.id && t.completed).length
        })).sort((a, b) => b.total - a.total); // Sort by most populated

        // Productivity Score: High priority completed * 3 + Medium * 2 + Low * 1
        const score = tasks.reduce((acc, t) => {
            if (!t.completed) return acc;
            const weight = t.priority === 'high' ? 3 : t.priority === 'medium' ? 2 : 1;
            return acc + weight;
        }, 0);

        return { total, completed, pending, percentage, byPriority, byList, score };
    }, [tasks, lists]);

    const getStrokeDash = (percent) => {
        const circumference = 2 * Math.PI * 45; // radius 45
        return `${(percent / 100) * circumference} ${circumference}`;
    };

    return (
        <div className="dashboard-container">
            {/* Top Cards Row */}
            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon-bg">
                        <Activity size={24} color="var(--accent-primary)" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Productivity Score</span>
                        <span className="stat-value">{stats.score}</span>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-bg">
                        <CheckCircle2 size={24} color="var(--success)" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Tasks Completed</span>
                        <span className="stat-value">{stats.completed} <span className="stat-sub">/ {stats.total}</span></span>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-bg">
                        <AlertCircle size={24} color="var(--danger)" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">High Priority Pending</span>
                        <span className="stat-value">
                            {tasks.filter(t => t.priority === 'high' && !t.completed).length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                {/* Completion Donut Chart */}
                <div className="chart-card glass-panel">
                    <h3>Overall Progress</h3>
                    <div className="donut-chart-wrapper">
                        <svg viewBox="0 0 100 100" className="donut-chart">
                            <circle cx="50" cy="50" r="45" className="donut-bg" />
                            <circle
                                cx="50" cy="50" r="45"
                                className="donut-segment"
                                strokeDasharray={getStrokeDash(stats.percentage)}
                                stroke="var(--accent-primary)"
                            />
                        </svg>
                        <div className="donut-content">
                            <span className="donut-percent">{stats.percentage}%</span>
                            <span className="donut-label">Done</span>
                        </div>
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="chart-card glass-panel">
                    <h3>Task Priorities</h3>
                    <div className="priority-bars">
                        <div className="p-bar-row">
                            <div className="p-label">High</div>
                            <div className="p-track">
                                <div
                                    className="p-fill"
                                    style={{
                                        width: `${stats.total ? (stats.byPriority.high / stats.total) * 100 : 0}%`,
                                        background: 'var(--danger)'
                                    }}
                                />
                            </div>
                            <div className="p-val">{stats.byPriority.high}</div>
                        </div>
                        <div className="p-bar-row">
                            <div className="p-label">Medium</div>
                            <div className="p-track">
                                <div
                                    className="p-fill"
                                    style={{
                                        width: `${stats.total ? (stats.byPriority.medium / stats.total) * 100 : 0}%`,
                                        background: 'var(--accent-primary)'
                                    }}
                                />
                            </div>
                            <div className="p-val">{stats.byPriority.medium}</div>
                        </div>
                        <div className="p-bar-row">
                            <div className="p-label">Low</div>
                            <div className="p-track">
                                <div
                                    className="p-fill"
                                    style={{
                                        width: `${stats.total ? (stats.byPriority.low / stats.total) * 100 : 0}%`,
                                        background: 'var(--success)'
                                    }}
                                />
                            </div>
                            <div className="p-val">{stats.byPriority.low}</div>
                        </div>
                    </div>
                </div>

                {/* List Breakdown */}
                <div className="chart-card glass-panel full-width">
                    <h3>Project Status</h3>
                    <div className="list-stats-grid">
                        {stats.byList.map(list => (
                            <div key={list.name} className="list-stat-item">
                                <div className="ls-header">
                                    <span className="ls-name">{list.name}</span>
                                    <span className="ls-count">{list.completed}/{list.total}</span>
                                </div>
                                <div className="ls-progress">
                                    <div
                                        className="ls-fill"
                                        style={{
                                            width: `${list.total ? (list.completed / list.total) * 100 : 0}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {stats.byList.length === 0 && <div className="empty-chart">No lists created</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
