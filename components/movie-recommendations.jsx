"use client"

import { Film, Star } from "lucide-react"

const MOVIE_RECOMMENDATIONS = {
  Calm: {
    title: "Relaxing & Peaceful Movies",
    description: "Perfect for maintaining your serene state",
    movies: [
      { title: "Lost in Translation", year: 2003, rating: 7.7, genre: "Drama", vibe: "Contemplative & Zen" },
      { title: "The Secret Garden", year: 2020, rating: 6.8, genre: "Family", vibe: "Peaceful & Healing" },
      { title: "My Neighbor Totoro", year: 1988, rating: 8.2, genre: "Animation", vibe: "Serene & Wholesome" },
      { title: "About Time", year: 2013, rating: 7.8, genre: "Drama/Romance", vibe: "Heartwarming" },
    ],
  },
  Stressed: {
    title: "Uplifting & Comforting Movies",
    description: "Help ease stress with feel-good entertainment",
    movies: [
      { title: "The Pursuit of Happyness", year: 2006, rating: 8.0, genre: "Drama", vibe: "Inspiring" },
      { title: "Forrest Gump", year: 1994, rating: 8.8, genre: "Drama", vibe: "Uplifting" },
      { title: "Paddington", year: 2014, rating: 7.8, genre: "Family", vibe: "Heartwarming" },
      { title: "Good as It Gets", year: 1997, rating: 7.7, genre: "Romance/Comedy", vibe: "Feel-good" },
    ],
  },
  Angry: {
    title: "Cathartic & Empowering Movies",
    description: "Channel and release intense emotions productively",
    movies: [
      { title: "Rocky", year: 1976, rating: 8.1, genre: "Sports/Drama", vibe: "Empowering" },
      { title: "Fight Club", year: 1999, rating: 8.8, genre: "Drama", vibe: "Intense & Cathartic" },
      { title: "Whiplash", year: 2014, rating: 8.5, genre: "Drama", vibe: "Powerful" },
      { title: "The Dark Knight", year: 2008, rating: 9.0, genre: "Action", vibe: "Thrilling" },
    ],
  },
  Focused: {
    title: "Inspiring & Engaging Movies",
    description: "Fuel your concentration and drive",
    movies: [
      { title: "The Social Network", year: 2010, rating: 7.7, genre: "Drama", vibe: "Intelligent" },
      { title: "Interstellar", year: 2014, rating: 8.6, genre: "Sci-Fi", vibe: "Mind-bending" },
      { title: "The Imitation Game", year: 2014, rating: 8.0, genre: "Drama", vibe: "Inspiring" },
      { title: "Inception", year: 2010, rating: 8.8, genre: "Sci-Fi", vibe: "Complex & Engaging" },
    ],
  },
  Happy: {
    title: "Joyful & Celebratory Movies",
    description: "Amplify and celebrate your happiness",
    movies: [
      { title: "Singin' in the Rain", year: 1952, rating: 8.3, genre: "Musical", vibe: "Joyful" },
      { title: "The Grand Budapest Hotel", year: 2014, rating: 8.1, genre: "Comedy/Drama", vibe: "Whimsical" },
      { title: "Amélie", year: 2001, rating: 8.3, genre: "Fantasy", vibe: "Charming & Delightful" },
      { title: "Coco", year: 2017, rating: 8.4, genre: "Animation", vibe: "Magical & Emotional" },
    ],
  },
}

export default function MovieRecommendations({ behavior }) {
  const recommendations = MOVIE_RECOMMENDATIONS[behavior] || MOVIE_RECOMMENDATIONS.Happy

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 space-y-6">
      <div className="flex items-center gap-3">
        <Film className="w-6 h-6 text-amber-500" />
        <div>
          <h3 className="text-2xl font-bold text-white">{recommendations.title}</h3>
          <p className="text-sm text-slate-400">{recommendations.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.movies.map((movie, idx) => (
          <div
            key={idx}
            className="bg-slate-700/40 rounded-xl p-5 border border-slate-600 hover:border-amber-500 transition-colors hover:shadow-lg hover:shadow-amber-500/20"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-white text-lg">{movie.title}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {movie.year} • {movie.genre}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-yellow-500">{movie.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-slate-600/50 rounded-full text-slate-300">{movie.vibe}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-4">
        <p className="text-white font-semibold flex items-center gap-2">
          <Film className="w-5 h-5" />
          Enjoy a movie tonight to enhance your mood!
        </p>
      </div>
    </div>
  )
}
