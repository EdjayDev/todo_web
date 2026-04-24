import { useState } from 'react'
import './App.css'

type Todo = {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [started, setStarted] = useState(false)
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (!input.trim()) return

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    }

    setTodos((prev) => [newTodo, ...prev])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  // Landing Page
  if (!started) {
    return (
      <div className="app-container">
        <header className="hero">
          <h1>Todo Manager</h1>
          <p className="subtitle">
            Organize your tasks, stay productive, and keep track of what matters.
          </p>
        </header>

        <main className="content">
          <section className="features">
            <h2>What you can do</h2>
            <ul>
              <li>✔ Add and manage your daily tasks</li>
              <li>✔ Mark tasks as completed</li>
              <li>✔ Stay focused with a clean workflow</li>
            </ul>
          </section>

          <section className="cta">
            <button className="start-btn" onClick={() => setStarted(true)}>
              Get Started
            </button>
          </section>
        </main>
      </div>
    )
  }

  // Todo App UI
  return (
    <div className="app-container">
      <h1>My Tasks</h1>

      <div className="todo-input">
        <input
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.length === 0 && <p>No tasks yet.</p>}

        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span
              className={todo.completed ? 'completed' : ''}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
