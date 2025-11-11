import React, { useState } from 'react'
import './CurrencyConverter.css'

// Conversor enfocado: solo USD <-> HNL
const CURRENCIES = ['USD','HNL']

export default function CurrencyConverter(){
  const [amount, setAmount] = useState(1)
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('HNL')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const convert = async ()=>{
    setLoading(true)
    setMessage('')
    try{
      const q = encodeURIComponent
      // 1) Proveedor principal: open.er-api.com (no requiere clave)
      try{
        const primary = `https://open.er-api.com/v6/latest/${q(from)}`
        const r = await fetch(primary)
        if(r.ok){
          const jd = await r.json()
          const rate = jd && jd.rates && jd.rates[to]
          if(typeof rate !== 'undefined'){
            const converted = (Number(amount)||0) * Number(rate)
            setMessage(`${amount} ${from} = ${Number(converted).toFixed(4)} ${to}`)
            return
          }
          console.warn('primary: tasa no encontrada en rates', jd)
        }else{
          console.warn('primary: HTTP fail', r.status, r.statusText)
        }
      }catch(primaryErr){
        console.warn('primary fetch failed', primaryErr)
      }

      // 2) Fallback: exchangerate.host /latest
      try{
        const url2 = `https://api.exchangerate.host/latest?base=${q(from)}&symbols=${q(to)}`
        const r2 = await fetch(url2)
        if(r2.ok){
          const jd = await r2.json()
          const rate = jd && jd.rates && jd.rates[to]
          if(typeof rate !== 'undefined'){
            const converted = (Number(amount)||0) * Number(rate)
            setMessage(`${amount} ${from} = ${Number(converted).toFixed(4)} ${to}`)
            return
          }
          console.warn('latest fallback: tasa no encontrada en rates', jd)
        }else{
          console.warn('latest fallback: HTTP fail', r2.status, r2.statusText)
        }
      }catch(errLatest){
        console.warn('latest fetch failed', errLatest)
      }

      // 3) Fallback final: Frankfurter
      try{
        const fq = encodeURIComponent
        const furl = `https://api.frankfurter.app/latest?amount=${fq(amount)}&from=${fq(from)}&to=${fq(to)}`
        const fres = await fetch(furl)
        if(fres.ok){
          const fd = await fres.json()
          const fRate = fd && fd.rates && fd.rates[to]
          if(typeof fRate !== 'undefined'){
            const fResult = (Number(amount)||0) * Number(fRate)
            setMessage(`${amount} ${from} = ${Number(fResult).toFixed(4)} ${to}`)
            return
          }
          console.warn('Frankfurter: tasa no encontrada', fd)
        }else{
          console.warn('Frankfurter HTTP', fres.status, fres.statusText)
        }
      }catch(fErr){
        console.warn('Frankfurter fallback failed', fErr)
      }

      // Si llegamos aquí, ninguno de los proveedores devolvió la tasa
      setMessage(`No se pudo obtener la tasa para ${from} → ${to}. Intente otra moneda o revise su conexión.`)
    }catch(err){
      console.error('Conversion error', err)
      setMessage('Error al obtener la tasa: ' + (err && err.message ? err.message : String(err)))
    }finally{ setLoading(false) }
  }

  // Pequeños iconos SVG para banderas (inline, sin dependencias)
  const Flag = ({ code }) => {
    if(code === 'USD'){
      return (
        <svg className="flag-icon" viewBox="0 0 7410 3900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="US flag">
          <rect width="7410" height="3900" fill="#b22234"/>
          <g fill="#fff">
            {Array.from({length:6}).map((_,i)=> <rect key={i} y={(i*600)+600} width="7410" height="300" />)}
          </g>
          <rect width="2964" height="2100" fill="#3c3b6e"/>
        </svg>
      )
    }
    // HND flag (approx, simplified)
    return (
      <svg className="flag-icon" viewBox="0 0 6 4" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Honduras flag">
        <rect width="6" height="4" fill="#0073cf"/>
        <rect y="1" width="6" height="2" fill="#fff"/>
        <g fill="#0073cf" transform="translate(3,2)">
          <polygon points="0,-1 0.15,-0.3 -0.15,-0.3" />
          <polygon points="0,0.3 0.15,1  -0.15,1" />
        </g>
      </svg>
    )
  }

  return (
    <div className="card converter-card p-3 mt-4">
      <div className="converter-header">
        <h4>Convertidor USD ↔ HNL</h4>
        <small className="text-muted">Rápido y sencillo — solo entre Dólar (USD) y Lempira (HNL)</small>
      </div>

      <div className="converter-body">
        <div className="row align-items-center">
          <div className="col-auto">
            <label className="form-label">Cantidad</label>
            <input className="form-control" type="number" value={amount} onChange={e=>setAmount(e.target.value)} />
          </div>

          <div className="col-auto d-flex align-items-start">
            <div style={{marginRight:8}}>
              <Flag code={from} />
            </div>
            <div>
              <label className="form-label">De</label>
              <select className="form-select" value={from} onChange={e=>setFrom(e.target.value)}>
                {CURRENCIES.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="col-auto swap-col">
            <button className="btn btn-outline-secondary swap-btn" onClick={()=>{ const p = to; setTo(from); setFrom(p) }} title="Intercambiar">↕</button>
          </div>

          <div className="col-auto d-flex align-items-start">
            <div style={{marginRight:8}}>
              <Flag code={to} />
            </div>
            <div>
              <label className="form-label">A</label>
              <select className="form-select" value={to} onChange={e=>setTo(e.target.value)}>
                {CURRENCIES.map(c=> <option key={c+"-to"} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="col-auto">
            <label className="form-label"> </label>
            <div>
              <button className="btn btn-primary w-100" onClick={convert} disabled={loading}>{loading? 'Convirtiendo...':'Convertir'}</button>
            </div>
          </div>
        </div>
      </div>

      {message && <div className="mt-3 converter-result" style={{whiteSpace:'pre-wrap'}}>{message}</div>}
    </div>
  )
}
