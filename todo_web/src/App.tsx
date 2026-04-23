import './App.css'

function App() {
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
          <button className="start-btn">Get Started</button>
        </section>
      </main>
    </div>
  )
}

export default App
