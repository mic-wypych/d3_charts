import { useState } from 'react'
import './App.css'
import { Barplot } from './Barplot'
import { SpinningBall } from './SpinningBall'

const data = [
  { country: "United States", students: 68 },
  { country: "France", students: 21 },
  { country: "United Kingdom", students: 21 },
  { country: "Germany", students: 20 },
  { country: "Switzerland", students: 13 },
  { country: "Spain", students: 10 },
  { country: "Netherlands", students: 9 },
  { country: "India", students: 9 },
  { country: "Singapore", students: 8 },
  { country: "Ireland", students: 8 },
  { country: "Sweden", students: 7 },
  { country: "Australia", students: 7 },
  { country: "Canada", students: 6 },
  { country: "Finland", students: 5 },
  { country: "Mexico", students: 4 },
  { country: "Brazil", students: 4 },
  { country: "Saudi Arabia", students: 3 },
  { country: "Romania", students: 3 },
  { country: "Philippines", students: 3 },
  { country: "New Zealand", students: 3 },
];

// ── Add new visualizations here ──────────────────────────────────────────────
const views = [
  { id: "barplot",      label: "Barplot",      component: <Barplot data={data} /> },
  { id: "spinningball", label: "Spinning Ball", component: <SpinningBall /> },
];
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [activeId, setActiveId] = useState(views[0].id);
  const activeView = views.find(v => v.id === activeId);

  return (
    <>
      <header id="app-header">
        <h1>d3 loves React 1st cohort</h1>
        <nav id="app-nav">
          {views.map(v => (
            <button
              key={v.id}
              className={`nav-btn ${v.id === activeId ? "active" : ""}`}
              onClick={() => setActiveId(v.id)}
            >
              {v.label}
            </button>
          ))}
        </nav>
      </header>
      <div id="center">
        {activeView.component}
      </div>
    </>
  )
}

export default App
