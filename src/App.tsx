import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from 'react-router-dom'
import 'devicon/devicon.min.css';
import InstallationPlanDisplay from '@/components/InstallationPlan'
import EvaluateEnvVars from '@/components/EvaluateEnvVars'
import InitialSelection from './components/InitialSelection';
import { ProjectDetails } from './components/ProjectDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitialSelection />} />
        <Route path="/project-setup" element={<ProjectDetails />} />
        <Route path="/install-plan" element={<InstallationPlanDisplay />} />
        <Route path="/evaluate-env-vars" element={<EvaluateEnvVars />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
