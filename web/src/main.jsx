import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem'}}>
        🎉 Codéna v3 LIVE !
      </h1>
      <p style={{fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center'}}>
        Fullstack FastAPI + React sur Render.com
      </p>
      <a href="https://codena-backend.onrender.com/docs" 
         style={{
           background: 'white', 
           color: '#3b82f6', 
           padding: '1rem 2rem', 
           borderRadius: '0.5rem', 
           fontWeight: 'bold', 
           textDecoration: 'none'
         }}>
        🚀 API Swagger Docs
      </a>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
