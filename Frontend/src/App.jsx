import Login from './Pages/Login.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './Pages/Register.jsx'
import Editor from './Pages/Editor.jsx'
import Projects from './Pages/Projects.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/editor/:id" element={<Editor />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
