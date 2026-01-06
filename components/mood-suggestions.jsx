"use client"

import { CheckCircle, Heart } from "lucide-react"

const MOOD_SUGGESTIONS = {
  Calm: {
    title: "Maintain Your Calm State",
    color: "emerald",
    suggestions: [
      {
        title: "Meditation & Mindfulness",
        description: "Continue practicing meditation for 10-15 minutes daily to maintain emotional balance",
        icon: "🧘",
      },
      {
        title: "Peaceful Environment",
        description: "Keep your workspace organized and free from distractions",
        icon: "🏠",
      },
      {
        title: "Nature Time",
        description: "Spend time outdoors or near plants to reinforce tranquility",
        icon: "🌿",
      },
      {
        title: "Breathing Exercises",
        description: "Practice deep breathing exercises (4-7-8 technique) for 5 minutes",
        icon: "💨",
      },
    ],
  },
  Stressed: {
    title: "Reduce Stress & Find Relief",
    color: "amber",
    suggestions: [
      {
        title: "Take Breaks",
        description: "Use the Pomodoro Technique: 25 minutes work, 5 minutes break",
        icon: "⏰",
      },
      {
        title: "Physical Activity",
        description: "Go for a 20-minute walk or do light stretching exercises",
        icon: "🚴",
      },
      {
        title: "Deep Breathing",
        description: "Practice box breathing: 4 counts in, hold, out, hold",
        icon: "🫁",
      },
      {
        title: "Journaling",
        description: "Write down your worries to process and organize your thoughts",
        icon: "📝",
      },
    ],
  },
  Angry: {
    title: "Manage Your Emotions",
    color: "red",
    suggestions: [
      {
        title: "Cool Down Interval",
        description: "Take a 10-15 minute break away from the situation",
        icon: "❄️",
      },
      {
        title: "Physical Release",
        description: "Try exercise, punching bag, or intense workout to release anger",
        icon: "💪",
      },
      {
        title: "Creative Expression",
        description: "Channel emotions into art, music, or writing",
        icon: "🎨",
      },
      {
        title: "Talk It Out",
        description: "Share your feelings with a trusted friend or counselor",
        icon: "💬",
      },
    ],
  },
  Focused: {
    title: "Maintain Peak Concentration",
    color: "blue",
    suggestions: [
      {
        title: "Optimize Environment",
        description: "Remove distractions: silence phone, close unnecessary tabs",
        icon: "🎯",
      },
      {
        title: "Deep Work Sessions",
        description: "Work in 90-minute focused blocks with proper breaks",
        icon: "⚡",
      },
      {
        title: "Healthy Nutrition",
        description: "Eat brain-boosting foods: nuts, blueberries, dark chocolate",
        icon: "🥗",
      },
      {
        title: "Quality Sleep",
        description: "Maintain 7-9 hours of sleep for optimal cognitive function",
        icon: "😴",
      },
    ],
  },
  Happy: {
    title: "Embrace Your Positivity",
    color: "pink",
    suggestions: [
      {
        title: "Share the Joy",
        description: "Spend time with loved ones and share positive energy",
        icon: "👥",
      },
      {
        title: "Celebrate Wins",
        description: "Acknowledge and celebrate your achievements, big and small",
        icon: "🎉",
      },
      {
        title: "Help Others",
        description: "Volunteer or help someone in need to amplify happiness",
        icon: "🤝",
      },
      {
        title: "Pursue Hobbies",
        description: "Engage in activities that bring you genuine joy and fulfillment",
        icon: "🎪",
      },
    ],
  },
}

export default function MoodSuggestions({ behavior }) {
  const suggestions = MOOD_SUGGESTIONS[behavior] || MOOD_SUGGESTIONS.Happy
  const colorClass = {
    emerald: "from-emerald-600 to-teal-600",
    amber: "from-amber-600 to-yellow-600",
    red: "from-red-600 to-orange-600",
    blue: "from-blue-600 to-cyan-600",
    pink: "from-pink-600 to-rose-600",
  }[suggestions.color]

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="w-6 h-6 text-pink-500" />
        <h3 className="text-2xl font-bold text-white">{suggestions.title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="bg-slate-700/40 rounded-xl p-4 border border-slate-600 hover:border-slate-500 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{suggestion.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{suggestion.title}</h4>
                <p className="text-sm text-slate-300">{suggestion.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`bg-gradient-to-r ${colorClass} rounded-xl p-4`}>
        <p className="text-white font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Implement these suggestions daily for best results!
        </p>
      </div>
    </div>
  )
}
