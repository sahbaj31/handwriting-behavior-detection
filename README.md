# Handwriting Behavior Detection System

A comprehensive full-stack application for analyzing handwriting patterns and detecting behavioral traits using AI/ML.

## Project Structure

### Frontend (Next.js)
- `/app/page.tsx` - Main application interface
- `/components/image-uploader.tsx` - Image upload component
- `/components/prediction-result.tsx` - Results visualization
- `/components/prediction-history.tsx` - History sidebar
- `/app/api/predict` - API route for predictions

### Backend (Python Flask)
- `/backend/app.py` - Flask server with prediction endpoints
- `/backend/model.py` - ML model and feature extraction
- `/scripts/train_model.py` - Training pipeline

### Database
- `/scripts/init-database.sql` - Database schema
- `/database.json` - Schema documentation

## Features

### 1. Image Analysis
- Upload handwriting samples (JPG, PNG, GIF, WebP)
- Real-time feature extraction and analysis
- Support for various handwriting styles

### 2. Behavior Detection (5 Classes)
- **Calm**: Composed and peaceful state
- **Stressed**: Anxious or tense state
- **Angry**: Aggressive emotional state
- **Focused**: Concentrated and attentive
- **Happy**: Positive and optimistic mood

### 3. Feature Analysis
- **Slant Angle**: Deviation from vertical axis (degrees)
- **Letter Size**: Average height of characters
- **Stroke Width**: Thickness of handwriting lines
- **Pressure**: Writing pressure from pixel intensity
- **Spacing**: Consistency of letter spacing

### 4. Results Visualization
- Confidence scores with visual indicators
- Behavior distribution charts
- Detailed behavioral analysis
- Downloadable reports

### 5. Prediction History
- Track all analyses with timestamps
- Visual confidence indicators
- Quick comparison between predictions

## Setup Instructions

### Frontend Setup
\`\`\`bash
# Install dependencies (handled by v0)
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

### Backend Setup
\`\`\`bash
# Install Python dependencies
pip install -r requirements.txt

# Install PyTorch
pip install torch torchvision torchaudio

# Run Flask server
python backend/app.py
\`\`\`

### Train Model
\`\`\`bash
# Prepare training dataset
# Create directory: datasets/training_images/
# Create labels file: datasets/labels.csv (format: "filename.jpg,label_index")

# Train the model
python scripts/train_model.py
\`\`\`

## API Endpoints

### Frontend Endpoints
- `POST /api/predict` - Submit image for prediction
- `POST /api/backend-predict` - Forward to Python backend

### Backend Endpoints
- `POST /predict` - Main prediction endpoint
- `GET /history` - Get prediction history
- `GET /stats` - Get statistics
- `GET /health` - Health check

## Environment Variables

\`\`\`env
# Backend Configuration
BACKEND_URL=http://localhost:5000
\`\`\`

## Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Recharts (visualization)
- Lucide Icons

### Backend
- Flask
- PyTorch
- OpenCV
- NumPy
- Pillow

### Database
- SQLite (development)
- Can be extended to PostgreSQL/MySQL

## Model Architecture

### CNN Model
- Input: 224x224 grayscale images
- Conv Layers: 3 layers (32, 64, 128 filters)
- MaxPooling: 2x2 pools
- Fully Connected: 256 → 128 → 5 classes
- Activation: ReLU
- Dropout: 0.5

### Feature Extraction
- Slant angle calculation using Hough line detection
- Letter size from contour bounding boxes
- Stroke width from pixel density analysis
- Pressure from image intensity gradients
- Spacing from horizontal projection analysis

## Dataset Format

For training, prepare your dataset:

\`\`\`
datasets/
  ├── training_images/
  │   ├── calm_001.jpg
  │   ├── stressed_001.jpg
  │   ├── angry_001.jpg
  │   ├── focused_001.jpg
  │   └── happy_001.jpg
  └── labels.csv
\`\`\`

Labels file format:
\`\`\`csv
calm_001.jpg,0
stressed_001.jpg,1
angry_001.jpg,2
focused_001.jpg,3
happy_001.jpg,4
\`\`\`

## Performance Metrics

- Accuracy: Depends on training data quality
- Inference Speed: ~100-500ms per image
- Supported Image Sizes: 224x224 to 1024x1024
- Max File Size: 5MB

## Future Enhancements

1. Real-time handwriting capture via canvas/tablet
2. Multi-language support
3. User authentication and cloud storage
4. Advanced analytics dashboard
5. Mobile app support
6. Integration with handwriting recognition APIs

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.
