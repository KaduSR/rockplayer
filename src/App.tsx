
import React, { useState, useEffect, useRef } from "react"
import "./styles.css"

const SONGS = [
  {id: 1, title: "Thunderstruck", artist: "AC/DC", album: "The Razors Edge", duration: 292, color: "#e74c3c"},
  {id: 2, title: "Back in Black", artist: "AC/DC", album: "Back in Black", duration: 255, color: "#333"},
  {id: 3, title: "Sweet Child O Mine", artist: "Guns N Roses", album: "Appetite for Destruction", duration: 356, color: "#8e44ad"},
  {id: 4, title: "Enter Sandman", artist: "Metallica", album: "Metallica", duration: 331, color: "#c0392b"},
  {id: 5, title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", duration: 301, color: "#2ecc71"},
  {id: 6, title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", duration: 355, color: "#f39c12"},
]

export default function App() {
  const [current, setCurrent] = useState<typeof SONGS[0] | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (playing && current) {
      intervalRef.current = setInterval(() => {
        setProgress(p => { const np = p + 1; if (np >= 100) { setPlaying(false); return 0 } return np })
      }, current.duration * 10)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, current])

  const play = (song: typeof SONGS[0]) => {
    if (current?.id === song.id) setPlaying(!playing)
    else { setCurrent(song); setProgress(0); setPlaying(true) }
  }
  const next = () => {
    const idx = SONGS.findIndex(s => s.id === current?.id)
    const nextSong = SONGS[(idx + 1) % SONGS.length]
    setCurrent(nextSong); setProgress(0); setPlaying(true)
  }
  const prev = () => {
    const idx = SONGS.findIndex(s => s.id === current?.id)
    const s = SONGS[(idx - 1 + SONGS.length) % SONGS.length]
    setCurrent(s); setProgress(0); setPlaying(true)
  }

  const bars = Array.from({length: 32}, (_, i) => ({
    height: Math.floor(Math.random() * 80 + 10) * (playing ? 1 : 0.2),
    delay: i * 0.05
  }))

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <h1>RockPlayer</h1>
          <span style={{color: "#a1a1aa", fontSize: ".85rem"}}>6 faixas</span>
        </div>
      </header>
      <main className="container">
        {current && (
          <div className="now-playing" style={{background: `linear-gradient(135deg, ${current.color}22, #0f0f0f)`}}>
            <div className="visualizer">
              {bars.map((b, i) => (
                <div key={i} className="bar" style={{
                  height: b.height, background: current.color,
                  animationDelay: b.delay + "s", opacity: playing ? 1 : 0.3
                }} />
              ))}
            </div>
            <div className="np-info">
              <span className="np-title">{current.title}</span>
              <span className="np-artist">{current.artist}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: progress + "%"}} />
            </div>
            <div className="controls">
              <button onClick={prev}>&#9664;&#9664;</button>
              <button className="play-btn" onClick={() => setPlaying(!playing)}>
                {playing ? "||" : "▶"}
              </button>
              <button onClick={next}>&#9654;&#9654;</button>
            </div>
            <div className="volume">
              &#x1F50A; <input type="range" min={0} max={100} value={volume}
                onChange={e => setVolume(Number(e.target.value))} />
            </div>
          </div>
        )}
        <div className="playlist">
          {SONGS.map(s => (
            <div key={s.id} className={"song-card " + (current?.id === s.id ? "active" : "")}
                 onClick={() => play(s)}>
              <div className="song-color" style={{background: s.color}} />
              <div className="song-info">
                <span className="song-title">{s.title}</span>
                <span className="song-artist">{s.artist}</span>
              </div>
              <span className="song-duration">{Math.floor(s.duration / 60)}:{String(s.duration % 60).padStart(2, "0")}</span>
              {current?.id === s.id && <span className="playing-indicator">{playing ? ">" : "||"}</span>}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
