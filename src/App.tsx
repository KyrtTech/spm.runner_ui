import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StrategyDisplay from '@/components/StrategyDisplay'
import EvaluateEnvVars from '@/components/EvaluateEnvVars' // Stub page for environment variable evaluation

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StrategyDisplay />} />
        <Route path="/evaluate-env-vars" element={<EvaluateEnvVars />} />
      </Routes>
    </Router>
  )
}

export default App
