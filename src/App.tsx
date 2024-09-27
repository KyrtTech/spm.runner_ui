import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'devicon/devicon.min.css';
import InstallationPlanDisplay from '@/components/InstallationPlan'
import EvaluateEnvVars from '@/components/EvaluateEnvVars'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InstallationPlanDisplay />} />
        <Route path="/evaluate-env-vars" element={<EvaluateEnvVars />} />
      </Routes>
    </Router>
  )
}

export default App
