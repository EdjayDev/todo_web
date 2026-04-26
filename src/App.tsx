import { useEffect, useState } from 'react'
import './App.css'

type Todo = {
  id: number
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

function App() {
  const [started, setStarted] = useState(false)
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!input.trim()) return

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    }

    setTodos(prev => [newTodo, ...prev])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id: number) => {
    if (!editText.trim()) return

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: editText.trim() } : todo
      )
    )

    setEditingId(null)
    setEditText('')
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // Landing Page
  if (!started) {
    return (
      <div className="app-container">
        <header className="hero">
          <h1>Todo Manager</h1>
          <p className="subtitle">
            Organize your tasks and stay productive.
          </p>
        </header>

        <main className="content">
          <button className="start-btn" onClick={() => setStarted(true)}>
            Get Started
          </button>
        </main>
      </div>
    )
  }

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

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.length === 0 && <p>No tasks.</p>}

        {filteredTodos.map(todo => (
          <li key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(todo.id)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                autoFocus
              />
            ) : (
              <span
                className={todo.completed ? 'completed' : ''}
                onClick={() => toggleTodo(todo.id)}
                onDoubleClick={() => startEdit(todo)}
              >
                {todo.text}
              </span>
            )}

            <button onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
