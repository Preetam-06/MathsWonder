
const GOLDEN = 0.618

function analyzeSong(duration, events) {
  const results = []

  events.forEach(e => {
    const pos = e.time / duration
    const dist = Math.abs(pos - GOLDEN)

    results.push({
      label: e.label,
      time: e.time,
      position: Number(pos.toFixed(3)),
      distance: Number(dist.toFixed(3))
    })
  })

  const closest = results.reduce((a, b) =>
    a.distance < b.distance ? a : b
  )

  const score = Number((1 - closest.distance).toFixed(3))

  return { results, closest, score }
}

function suggestGoldenPoints(duration) {
  return {
    buildUp: Number((duration * 0.382).toFixed(2)),
    climax: Number((duration * GOLDEN).toFixed(2))
  }
}

// ===============================
// UI LOGIC
// ===============================

// Advisor mode
document.getElementById('suggestBtn').onclick = () => {
  const duration = Number(
    document.getElementById('durationInput').value
  )
  if (!duration) return

  const points = suggestGoldenPoints(duration)

  document.getElementById('advisorResult').innerHTML =
    `🔹 Build-up: <b>${points.buildUp}s</b><br>
     ⭐ Golden Ratio: <b>${points.climax}s</b>`
}

// Analyzer mode (wave editor)
const wave = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#3b82f6',
  progressColor: '#facc15',
  cursorColor: '#facc15',
  height: 150
})

const goldenLine = document.getElementById('goldenLine')

document.getElementById('audioUpload').addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (!file) return

  wave.loadBlob(file)

  wave.on('ready', () => {
    const duration = wave.getDuration()

    // Example events (replace with AI later)
    const events = [
      { label: "Intro End", time: duration * 0.15 },
      { label: "Build-up", time: duration * 0.38 },
      { label: "Drop", time: duration * 0.62 },
      { label: "Outro", time: duration * 0.85 }
    ]

    const { results, closest, score } =
      analyzeSong(duration, events)

    // Draw golden ratio line
    const width = document.getElementById('waveform').clientWidth
    goldenLine.style.left = (GOLDEN * width) + "px"

    console.table(results)
    console.log("Closest:", closest)
    console.log("Golden Score:", score)
  })
})
