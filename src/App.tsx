import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'devicon/devicon.min.css';
import InstallationPlanDisplay from '@/components/InstallationPlan'
import EvaluateEnvVars from '@/components/EvaluateEnvVars'
import InitialSelection from './components/InitialSelection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialSelection />} />
        <Route path="/install-plan" element={<InstallationPlanDisplay />} />
        <Route path="/evaluate-env-vars" element={<EvaluateEnvVars />} />
      </Routes>
    </Router>
  )
}

export default App
