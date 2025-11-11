import React, { useState } from 'react'
import './CurrencyConverter.css'

// Conversor simple usando solo exchangerate.host para mejorar velocidad
const CURRENCIES = [
  'USD','EUR','GBP','JPY','CAD','AUD',
  'CRC','HNL','GTQ','NIO','PAB','BZD' // Centroamérica
]

export default function CurrencyConverter(){
  const [amount, setAmount] = useState(1)
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const convert = async ()=>{
    setLoading(true)
    setMessage('')
    try{
      const q = encodeURIComponent
      const url = `https://api.exchangerate.host/convert?from=${q(from)}&to=${q(to)}&amount=${q(amount)}`
      const res = await fetch(url)
      if(!res.ok){
        const text = await res.text().catch(()=>res.statusText||'')
        const errMsg = `HTTP ${res.status} ${res.statusText} ${text}`
        console.error('Fetch error', errMsg)
        setMessage('Error al conectar con la API: ' + errMsg)
        return
      }
      const d = await res.json()
      if(typeof d.result === 'undefined'){
        console.error('API response missing result', d)
        setMessage('Respuesta inesperada de la API: ' + JSON.stringify(d))
        return
      }
      const rate = d.info && d.info.rate ? d.info.rate : (d.result / (Number(amount)||1))
      setMessage(`${amount} ${from} = ${Number(d.result).toFixed(4)} ${to} (rate: ${Number(rate).toFixed(6)})`)
    }catch(err){
      console.error('Conversion error', err)
      setMessage('Error al obtener la tasa: ' + (err && err.message ? err.message : String(err)))
    }finally{ setLoading(false) }
  }

  return (
    <div className="card p-3 mt-4" style={{maxWidth:520, margin:'0 auto'}}>
      <h5>Conversor</h5>

      <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{width:100}} />
        <select value={from} onChange={e=>setFrom(e.target.value)}>{CURRENCIES.map(c=> <option key={c} value={c}>{c}</option>)}</select>
        <button onClick={()=>{ const p = to; setTo(from); setFrom(p) }} title="swap">↕</button>
        <select value={to} onChange={e=>setTo(e.target.value)}>{CURRENCIES.map(c=> <option key={c+"-to"} value={c}>{c}</option>)}</select>
      </div>

      <div style={{marginTop:10}}>
        <button className="btn btn-primary" onClick={convert} disabled={loading}>{loading? 'Convirtiendo...':'Convertir'}</button>
      </div>

      {message && <div className="mt-3" style={{whiteSpace:'pre-wrap'}}>{message}</div>}
    </div>
  )
}
