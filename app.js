const GOLDEN = 0.618;

// ===============================
// CORE ANALYSIS
// ===============================

function analyzeSong(duration, events) {
  if (!duration || duration <= 0) return null;

  const results = events.map(e => {
    const position = e.time / duration;
    const distance = Math.abs(position - GOLDEN);

    return {
      label: e.label,
      time: Number(e.time.toFixed(2)),
      position: Number(position.toFixed(3)),
      distance: Number(distance.toFixed(3))
    };
  });

  const closest = results.reduce((a, b) =>
    a.distance < b.distance ? a : b
  );

  const score = Number(
    Math.max(0, (1 - closest.distance / GOLDEN)).toFixed(3)
  );

  return { results, closest, score };
}

function suggestGoldenPoints(duration) {
  return {
    buildUp: Number((duration * 0.382).toFixed(2)),
    climax: Number((duration * GOLDEN).toFixed(2))
  };
}

// ===============================
// UI LOGIC
// ===============================

// Advisor mode
document.getElementById('suggestBtn').onclick = () => {
  const duration = Number(
    document.getElementById('durationInput').value
  );
  if (!duration || duration <= 0) return;

  const points = suggestGoldenPoints(duration);

  document.getElementById('advisorResult').innerHTML = `
    🔹 Build-up: <b>${points.buildUp} s</b><br>
    ⭐ Golden Ratio Point: <b>${points.climax} s</b>
  `;
};

// ===============================
// WAVE ANALYZER
// ===============================

const wave = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#3b82f6',
  progressColor: '#facc15',
  cursorColor: '#facc15',
  height: 150
});

const goldenLine = document.getElementById('goldenLine');

document
  .getElementById('audioUpload')
  .addEventListener('change', (e) => {

    const file = e.target.files[0];
    if (!file) return;

    wave.loadBlob(file);

    wave.on('ready', () => {
      const duration = wave.getDuration();
      if (!duration || duration <= 0) return;

      // Example structural events (manual / placeholder)
      const events = [
        { label: "Intro End", time: duration * 0.15 },
        { label: "Build-up", time: duration * 0.38 },
        { label: "Drop", time: duration * 0.62 },
        { label: "Outro", time: duration * 0.85 }
      ];

      const analysis = analyzeSong(duration, events);
      if (!analysis) return;

      // Golden line stays proportional
      goldenLine.style.left = "61.8%";

      console.table(analysis.results);
      console.log("Closest Event:", analysis.closest);
      console.log("Golden Alignment Score:", analysis.score);
    });
});