const GOLDEN = 0.618;

// CORE ANALYSIS

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

// UI

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
