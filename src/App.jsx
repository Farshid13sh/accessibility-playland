import { HashRouter, Routes, Route } from 'react-router-dom'
import AccessibilityLab from './AccessibilityLab'
import Experience from './Experience'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AccessibilityLab />} />
        <Route path="/experience" element={<Experience />} />
      </Routes>
    </HashRouter>
  )
}
