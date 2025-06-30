import { useNavigate } from 'react-router-dom'

function BackButton({ className = '' }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(-1)}
      className={`text-slate-600 hover:text-slate-800 ${className}`}
      aria-label="Go back"
    >
      <span className="material-icons">arrow_back</span>
    </button>
  )
}

export default BackButton
