import { useState, useEffect } from 'react'
import './App.css'
import { Barplot } from './Barplot'
import { SpinningBall } from './SpinningBall'
import { SimpleSvg } from './SimpleSvg'
import { EconomistChart } from './EconomistChart'
import { ShadcnuiTest } from './ShadcnuiTest'
import { EnergyDashboard } from './energyDashboard'
import { GapminderData } from "./GapminderData";
import { EnergyData} from "./EnergyData.tsx";
import { BubbleChart } from './BubbleChart'

interface CountryData {
  country: string;
  students: number;
}

interface View {
  id: string;
  label: string;
  component: React.ReactElement;
}

const data: CountryData[] = [
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
const views: View[] = [
  { id: "barplot",      label: "Barplot",      component: <Barplot data={data} /> },
  { id: "simplesvg",    label: "Simple Svg",    component: <SimpleSvg /> },
  { id: "economist",    label: "Economist Chart", component: <EconomistChart /> },
  { id: "bubble_chart", label: "Bubble Chart", component: <BubbleChart data = {GapminderData} />},
  { id: "shadcn_test",  label: "Testing ShadcnUI", component: <ShadcnuiTest />},
  { id: "energy",       label: "Energy Dashboard", component: <EnergyDashboard /> },
]
  
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  // Check for redirect parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get('redirect');
  
  // Get initial view from URL path or redirect
  let viewFromUrl;
  if (redirectPath) {
    viewFromUrl = redirectPath.split('/').pop();
    // Clean up URL
    window.history.replaceState({}, '', `/d3_charts/${viewFromUrl}`);
  } else {
    const pathParts = window.location.pathname.split('/');
    viewFromUrl = pathParts[pathParts.length - 1];
  }
  
  const initialView = views.find(v => v.id === viewFromUrl)?.id || views[0].id;
  
  const [activeId, setActiveId] = useState<string>(initialView);
  const activeView = views.find(v => v.id === activeId);

  // Update URL when activeId changes
  useEffect(() => {
    const base = '/d3_charts';
    const newPath = `${base}/${activeId}`;
    window.history.pushState({}, '', newPath);
  }, [activeId]);

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
        {activeView?.component}
      </div>
    </>
  )
}

export default App
