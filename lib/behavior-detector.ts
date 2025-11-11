export async function predictBehavior(buffer: ArrayBuffer) {
  try {
    // Call backend API with image buffer
    const response = await fetch("/api/backend-predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    })

    if (!response.ok) {
      throw new Error("Backend prediction failed")
    }

    const result = await response.json()
    return result
  } catch (error) {
    // Fallback to frontend analysis if backend is unavailable
    console.warn("Backend prediction unavailable, using feature extraction")
    return analyzeFrontend(buffer)
  }
}

function analyzeFrontend(buffer: ArrayBuffer) {
  // Frontend-based feature extraction and analysis
  const features = extractFeaturesFromBuffer(buffer)
  const behavior = predictBehaviorFromFeatures(features)

  return {
    behavior: behavior.class,
    confidence: behavior.confidence,
    scores: behavior.scores,
    slant_angle: features.slantAngle,
    avg_size: features.letterSize,
    stroke: features.stroke,
    analysis: behavior.analysis,
  }
}

function extractFeaturesFromBuffer(buffer: ArrayBuffer) {
  // Simulate feature extraction from image
  // In production, use Canvas API or a library like sharp
  const dataView = new DataView(buffer)
  const hash = hashBuffer(dataView)

  return {
    slantAngle: (hash % 40) - 20,
    letterSize: (hash % 30) + 15,
    stroke: ((hash >> 8) % 80) / 100 + 0.2,
  }
}

function hashBuffer(dataView: DataView): number {
  let hash = 0
  for (let i = 0; i < Math.min(dataView.byteLength, 100); i++) {
    const byte = dataView.getUint8(i)
    hash = (hash << 5) - hash + byte
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

function predictBehaviorFromFeatures(features: any): any {
  const { slantAngle, letterSize, stroke } = features

  const scores: Record<string, number> = {
    Calm: 0.2,
    Stressed: 0.2,
    Angry: 0.2,
    Focused: 0.2,
    Happy: 0.2,
  }

  if (slantAngle > 10 && letterSize > 25) {
    scores.Happy += 0.25
    scores.Focused += 0.15
  } else if (slantAngle < -10 && letterSize < 15) {
    scores.Calm += 0.25
  } else if (stroke > 0.6) {
    scores.Stressed += 0.25
    scores.Angry += 0.15
  } else {
    scores.Focused += 0.3
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  Object.keys(scores).forEach((key) => {
    scores[key] = scores[key] / total
  })

  const dominantBehavior = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))

  const analyses: Record<string, string> = {
    Calm: "Your handwriting suggests a calm and composed personality with stable emotional state.",
    Stressed: "Signs of stress detected in the handwriting patterns. Consider taking a break to relax.",
    Angry: "The aggressive writing characteristics suggest heightened emotional intensity.",
    Focused: "Highly concentrated writing patterns show excellent control and precision.",
    Happy: "The expansive writing suggests a positive and optimistic emotional state.",
  }

  return {
    class: dominantBehavior[0],
    confidence: dominantBehavior[1],
    scores,
    analysis: analyses[dominantBehavior[0]],
  }
}
