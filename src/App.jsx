import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Circle, CheckCircle2, AlertCircle, Edit2, X, MoreVertical, Layout, ListTodo, Presentation, BarChart3, LayoutDashboard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  // Initialize Lists
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('study-lists');
    if (savedLists) return JSON.parse(savedLists);
    return [{ id: 'default-1', title: 'To Do' }];
  });

  // Initialize Tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('study-tasks');
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
    return parsedTasks;
  });

  // 'board' or 'dashboard'
  const [currentView, setCurrentView] = useState('board');

  const [newTaskInput, setNewTaskInput] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  const [editingListId, setEditingListId] = useState(null);
  const [editingListTitle, setEditingListTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('study-lists', JSON.stringify(lists));
    localStorage.setItem('study-tasks', JSON.stringify(tasks));
  }, [lists, tasks]);

  const addList = () => {
    const newList = {
      id: crypto.randomUUID(),
      title: 'New List'
    };
    setLists([...lists, newList]);
    setEditingListId(newList.id);
    setEditingListTitle(newList.title);
    // Be sure to switch to board view if adding a list
    if (currentView === 'dashboard') setCurrentView('board');
  };

  const deleteList = (listId) => {
    if (confirm('Are you sure you want to delete this list and all its tasks?')) {
      setLists(lists.filter(l => l.id !== listId));
      setTasks(tasks.filter(t => t.listId !== listId));
    }
  };

  const updateListTitle = (listId) => {
    if (!editingListTitle.trim()) return;
    setLists(lists.map(l =>
      l.id === listId ? { ...l, title: editingListTitle } : l
    ));
    setEditingListId(null);
  };

  const addTask = (listId) => {
    const text = newTaskInput[listId]?.trim();
    if (!text) return;

    const newTask = {
      id: crypto.randomUUID(),
      listId,
      text,
      priority: 'medium',
      completed: false,
      createdAt: Date.now()
    };

    setTasks([...tasks, newTask]);
    setNewTaskInput({ ...newTaskInput, [listId]: '' });
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const startEditingTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const saveEditingTask = (taskId) => {
    if (!editingTaskText.trim()) return;
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, text: editingTaskText } : t
    ));
    setEditingTaskId(null);
  };

  const cyclePriority = (taskId) => {
    const priorities = ['low', 'medium', 'high'];
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const currentIdx = priorities.indexOf(t.priority || 'medium');
        const nextIdx = (currentIdx + 1) % priorities.length;
        return { ...t, priority: priorities[nextIdx] };
      }
      return t;
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--accent-primary)';
      case 'low': return 'var(--success)';
      default: return 'var(--accent-primary)';
    }
  };

  const getTasksForList = (listId) => tasks.filter(t => t.listId === listId);

  const calculateTotalProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-container">
          <ListTodo className="icon-main" />
          <h1>Task Master</h1>
        </div>

        <div className="header-actions">
          {/* View Switcher */}
          <div className="view-tabs">
            <button
              className={`view-tab-btn ${currentView === 'board' ? 'active' : ''}`}
              onClick={() => setCurrentView('board')}
            >
              <LayoutDashboard size={18} />
              Board
            </button>
            <button
              className={`view-tab-btn ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <BarChart3 size={18} />
              Analytics
            </button>
          </div>

          <div className="progress-badge glass-panel">
            <span>{calculateTotalProgress()}% Done</span>
            <div className="mini-progress-bar">
              <div
                className="mini-progress-fill"
                style={{ width: `${calculateTotalProgress()}%` }}
              ></div>
            </div>
          </div>

          <button className="add-list-btn" onClick={addList}>
            <Plus size={20} />
            <span>New List</span>
          </button>
        </div>
      </header>

      {currentView === 'dashboard' ? (
        <Dashboard tasks={tasks} lists={lists} />
      ) : (
        <div className="lists-container">
          {lists.map(list => (
            <div key={list.id} className="list-column glass-panel">
              <div className="list-header">
                {editingListId === list.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editingListTitle}
                    onChange={(e) => setEditingListTitle(e.target.value)}
                    onBlur={() => updateListTitle(list.id)}
                    onKeyDown={(e) => e.key === 'Enter' && updateListTitle(list.id)}
                    className="list-title-input"
                  />
                ) : (
                  <h2
                    className="list-title"
                    onClick={() => {
                      setEditingListId(list.id);
                      setEditingListTitle(list.title);
                    }}
                  >
                    {list.title}
                  </h2>
                )}

                <button
                  className="delete-list-btn"
                  onClick={() => deleteList(list.id)}
                  title="Delete List"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="task-list">
                {getTasksForList(list.id).length === 0 && (
                  <div className="empty-state">Empty list</div>
                )}
                {getTasksForList(list.id).map(task => (
                  <div
                    key={task.id}
                    className={`task-card ${task.completed ? 'completed' : ''}`}
                    style={{ borderLeft: `3px solid ${getPriorityColor(task.priority || 'medium')}` }}
                  >
                    <button
                      className="check-btn"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ?
                        <CheckCircle2 size={20} className="check-icon active" /> :
                        <Circle size={20} className="check-icon" />
                      }
                    </button>

                    {editingTaskId === task.id ? (
                      <div className="edit-mode">
                        <input
                          autoFocus
                          type="text"
                          value={editingTaskText}
                          onChange={(e) => setEditingTaskText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditingTask(task.id);
                            if (e.key === 'Escape') setEditingTaskId(null);
                          }}
                          onBlur={() => saveEditingTask(task.id)}
                          className="edit-input"
                        />
                      </div>
                    ) : (
                      <span
                        className="task-text"
                        onDoubleClick={() => startEditingTask(task)}
                        title="Double click to edit"
                      >
                        {task.text}
                      </span>
                    )}

                    <div className="task-actions">
                      <button
                        className="priority-btn"
                        onClick={() => cyclePriority(task.id)}
                        title={`Priority: ${task.priority || 'medium'}`}
                        style={{ color: getPriorityColor(task.priority || 'medium') }}
                      >
                        <AlertCircle size={14} />
                      </button>
                      {!editingTaskId && (
                        <button
                          className="delete-btn"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="add-task-wrapper">
                <input
                  type="text"
                  placeholder="Add a task..."
                  value={newTaskInput[list.id] || ''}
                  onChange={(e) => setNewTaskInput({ ...newTaskInput, [list.id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addTask(list.id)}
                  className="add-input"
                />
                <button
                  className="add-btn"
                  onClick={() => addTask(list.id)}
                  disabled={!newTaskInput[list.id]?.trim()}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}

          <button className="new-list-placeholder glass-panel" onClick={addList}>
            <Plus size={24} />
            <span>Add List</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
