import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const sendOTP = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://codena-backend.onrender.com/auth/otp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `221${phone}` })
      })
      if (res.ok) {
        setOtpSent(true)
        alert('✅ OTP envoyé ! Vérifie SMS')
      } else {
        alert('❌ Erreur backend')
      }
    } catch {
      alert('❌ Réseau erreur')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
      color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui'
    }}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}> Codéna v3</h1>
      <p>Préparation Permis Dakar</p>
      
      <div style={{maxWidth: '400px', textAlign: 'center'}}>
        <input 
          type="tel" placeholder="77XXX XXXX" value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g,''))}
          style={{width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '0.5rem', border: 'none'}}
        />
        <button onClick={sendOTP} disabled={!phone || loading}
          style={{background: 'white', color: '#3b82f6', padding: '1rem 2rem', borderRadius: '0.5rem', border: 'none'}}>
          {loading ? '⏳ Envoi...' : '📱 Envoyer OTP'}
        </button>
      </div>
      
      <a href="https://codena-backend.onrender.com/docs" style={{marginTop: '2rem'}}>
         API Docs
      </a>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
