import { useEffect, useMemo, useState } from 'react'
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

  // safer load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('todos')
      if (saved) setTodos(JSON.parse(saved))
    } catch {
      console.warn('Failed to parse todos from localStorage')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    const value = input.trim()
    if (!value) return

    setTodos(prev => [
      {
        id: Date.now() + Math.random(), // avoids collisions
        text: value,
        completed: false,
      },
      ...prev,
    ])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const saveEdit = (id: number) => {
    const value = editText.trim()
    if (!value) {
      cancelEdit()
      return
    }

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: value } : todo
      )
    )

    cancelEdit()
  }

  const filteredTodos = useMemo(() => {
    const map = {
      all: () => true,
      active: (t: Todo) => !t.completed,
      completed: (t: Todo) => t.completed,
    }
    return todos.filter(map[filter])
  }, [todos, filter])

  const remaining = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos]
  )

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
        <button onClick={addTodo} disabled={!input.trim()}>
          Add
        </button>
      </div>

      <div className="filters">
        {(['all', 'active', 'completed'] as Filter[]).map(f => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="todo-meta">
        <span>{remaining} remaining</span>
        <button onClick={clearCompleted}>Clear completed</button>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(todo.id)
                  if (e.key === 'Escape') cancelEdit()
                }}
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
