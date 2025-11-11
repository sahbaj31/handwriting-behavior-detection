from flask import Flask, request, jsonify
from flask_cors import CORS
from model import get_model
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# Load model
model = get_model()

# In-memory storage for predictions (replace with database in production)
predictions_store = []

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read file bytes
        file_bytes = file.read()
        
        # Get prediction
        prediction = model.predict(file_bytes)
        
        # Add metadata
        prediction['timestamp'] = datetime.now().isoformat()
        prediction['filename'] = file.filename
        
        # Store prediction
        predictions_store.append(prediction)
        
        return jsonify(prediction)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    """Get prediction history"""
    limit = request.args.get('limit', 50, type=int)
    return jsonify(predictions_store[-limit:])

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get statistics about predictions"""
    if not predictions_store:
        return jsonify({
            'total_predictions': 0,
            'behavior_distribution': {},
            'average_confidence': 0
        })
    
    behavior_counts = {}
    total_confidence = 0
    
    for pred in predictions_store:
        behavior = pred.get('behavior', 'Unknown')
        behavior_counts[behavior] = behavior_counts.get(behavior, 0) + 1
        total_confidence += pred.get('confidence', 0)
    
    return jsonify({
        'total_predictions': len(predictions_store),
        'behavior_distribution': behavior_counts,
        'average_confidence': total_confidence / len(predictions_store) if predictions_store else 0
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
