import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AccessibilityLab from './AccessibilityLab'
import Experience from './Experience'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccessibilityLab />} />
        <Route path="/experience" element={<Experience />} />
      </Routes>
    </BrowserRouter>
  )
}
