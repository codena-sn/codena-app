import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const sendOTP = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://codena-backend.onrender.com/auth/otp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `221${phone}` })
      })
      if (res.ok) setOtpSent(true)
    } catch (e) {
      alert('Erreur envoi OTP')
    }
    setLoading(false)
  }

  const verifyOTP = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://codena-backend.onrender.com/auth/otp-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `221${phone}`, code: otp })
      })
      if (res.ok) {
        alert('✅ Login OK ! Bienvenue Codéna')
        // Redirige dashboard
      } else {
        alert('❌ Code OTP incorrect')
      }
    } catch (e) {
      alert('Erreur vérification')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)', 
      color: 'white', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui'
    }}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>🎉 Codéna v3</h1>
      
      {!otpSent ? (
        <div style={{maxWidth: '400px', textAlign: 'center'}}>
          <p>Préparation Permis Dakar</p>
          <input 
            type="tel" 
            placeholder="77XXX XXXX" 
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g,''))}
            style={{
              width: '100%', padding: '1rem', margin: '1rem 0', 
              borderRadius: '0.5rem', border: 'none', fontSize: '1.2rem'
            }}
          />
          <button 
            onClick={sendOTP} 
            disabled={!phone || loading}
            style={{
              background: 'white', color: '#3b82f6', padding: '1rem 2rem', 
              borderRadius: '0.5rem', border: 'none', fontWeight: 'bold',
              cursor: phone ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? '⏳ Envoi...' : '📱 Envoyer OTP'}
          </button>
        </div>
      ) : (
        <div style={{maxWidth: '400px', textAlign: 'center'}}>
          <p>Code OTP reçu sur 221{phone}</p>
          <input 
            type="text" 
            placeholder="123456" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            style={{
              width: '100%', padding: '1rem', margin: '1rem 0', 
              borderRadius: '0.5rem', border: 'none', fontSize: '1.5rem', textAlign: 'center'
            }}
          />
          <button 
            onClick={verifyOTP} 
            disabled={otp.length !== 6 || loading}
            style={{
              background: otp.length === 6 ? 'white' : '#9ca3af', 
              color: otp.length === 6 ? '#3b82f6' : 'white',
              padding: '1rem 2rem', borderRadius: '0.5rem', 
              border: 'none', fontWeight: 'bold', cursor: otp.length === 6 ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? '⏳ Vérif...' : '✅ Confirmer Login'}
          </button>
        </div>
      )}
      
      <a href="https://codena-backend.onrender.com/docs" 
         style={{marginTop: '2rem', color: 'white', textDecoration: 'none'}}>
        📚 API Docs
      </a>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
