-- Handwriting Behavior Detection Database Schema

CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  behavior TEXT NOT NULL,
  confidence REAL NOT NULL,
  scores JSON NOT NULL,
  slant_angle REAL,
  avg_size REAL,
  stroke REAL,
  analysis TEXT,
  image_hash TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS behavior_classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  characteristics TEXT,
  color_code TEXT,
  emoji TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS datasets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  behavior TEXT NOT NULL,
  image_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default behavior classes
INSERT OR IGNORE INTO behavior_classes (name, description, characteristics, color_code, emoji) VALUES
  ('Calm', 'Composed and peaceful state', 'Steady strokes, balanced sizes, uniform pressure', '#10b981', '☘️'),
  ('Stressed', 'Anxious or tense state', 'Irregular strokes, varying pressure, rushed appearance', '#f59e0b', '⚡'),
  ('Angry', 'Aggressive emotional state', 'Heavy pressure, sharp angles, large sizes', '#ef4444', '🔥'),
  ('Focused', 'Concentrated and attentive', 'Precise letters, consistent sizing, controlled pressure', '#3b82f6', '🎯'),
  ('Happy', 'Positive and optimistic mood', 'Expansive writing, flowing strokes, upward slant', '#ec4899', '😊');

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_predictions_behavior ON predictions(behavior);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
