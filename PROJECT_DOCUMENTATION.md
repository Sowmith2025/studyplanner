# Study Planner & Task Master - Project Documentation

## 1. Project Overview
**Task Master** is a modern, gamified study planner and task management web application. It allows users to organize tasks into customizable lists (e.g., "To Do", "Study Math", "Projects"), track their progress visually, and prioritize their work.

The application is built using **React + Vite** and features a premium "Glassmorphism" UI design with CSS-only animations and charts.

---

## 2. User Workflow
The application supports two primary views: **Board View** and **Analytics View**.

### A. Board View (Task Management)
*   **Creating Lists**: Users can create new lists (columns) to categorize tasks (e.g., by subject or day).
*   **Adding Tasks**: Inside each list, users can add new tasks by typing and pressing Enter.
*   **Task Management**:
    *   **Complete**: Click the circle icon to toggle completion.
    *   **Priority**: Click the alert icon to cycle priorities (Low → Medium → High). The card border color changes accordingly.
    *   **Edit**: Double-click task text to edit inline.
    *   **Delete**: Remove tasks or entire lists.
*   **Persistence**: All data is automatically saved to the browser's `LocalStorage`, preserving functionality across reloads.

### B. Analytics View (Dashboard)
*   **Overview**: Provides high-level metrics on productivity.
*   **Productivity Score**: A calculated metric based on completed tasks, weighted by priority (High = 3pts, Medium = 2pts, Low = 1pt).
*   **Visual Charts**:
    *   **Donut Chart**: Overall completion percentage.
    *   **Priority Breakdown**: Horizontal bars showing the distribution of pending tasks by urgency.
    *   **List Progress**: Individual progress bars for each customizable list.

---

## 3. Technical Architecture & Code Explanation

### A. Project Structure
```text
studyplanner/
├── src/
│   ├── components/
│   │   └── Dashboard.jsx    # Analytics view component
│   ├── App.jsx              # Main application logic & state
│   ├── App.css              # Main styling (Layout, Cards, Glassmorphism)
│   ├── index.css            # Global variables (Colors, Fonts)
│   └── main.jsx             # React entry point
├── index.html               # HTML root
└── package.json             # Dependencies
```

### B. Key Components

#### 1. `App.jsx` (The Controller)
This is the core component that manages the application state.
*   **State Management**:
    *   `lists`: Array of list objects `{ id, title }`.
    *   `tasks`: Array of task objects `{ id, listId, text, completed, priority }`.
    *   `currentView`: Toggles between `'board'` and `'dashboard'`.
*   **Persistence**: Uses `useEffect` to sync `lists` and `tasks` with `localStorage`.
*   **Logic**: Handles CRUD operations (Create, Read, Update, Delete) for both lists and tasks.

#### 2. `Dashboard.jsx` (The Analyzer)
A pure presentation component that receives `tasks` and `lists` as props.
*   **`useMemo` Hook**: efficiently calculates derived statistics (scores, percentages) whenever data changes, preventing unnecessary re-calculations.
*   **SVG Charts**: Renders the Donut chart and progress bars using standard HTML/CSS and SVG, ensuring high performance without heavy charting libraries.

### C. Styling Strategy (`App.css`, `index.css`)
*   **CSS Variables**: Defined in `index.css` for consistent theming (e.g., `--accent-primary`, `--glass-bg`).
*   **Glassmorphism**: Extensive use of `backdrop-filter: blur()`, semi-transparent backgrounds, and subtle borders to create a modern, depth-based UI.
*   **Responsive Grid**: The layout adapts from a horizontal scroll (Kanban style) on desktop to a vertical stack on mobile devices.

---

## 4. How to Run
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Build for Production**:
    ```bash
    npm run build
    ```
