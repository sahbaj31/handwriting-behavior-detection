import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
import cv2
import numpy as np
from PIL import Image
import io

# CNN Model Architecture
class HandwritingBehaviorCNN(nn.Module):
    def __init__(self):
        super(HandwritingBehaviorCNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(128 * 28 * 28, 256)
        self.fc2 = nn.Linear(256, 128)
        self.fc3 = nn.Linear(128, 5)  # 5 behavior classes
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = self.pool(F.relu(self.conv3(x)))
        x = x.view(-1, 128 * 28 * 28)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = F.relu(self.fc2(x))
        x = self.dropout(x)
        x = self.fc3(x)
        return x

# Feature Extraction
class HandwritingFeatureExtractor:
    def __init__(self):
        self.behavior_classes = ['Calm', 'Stressed', 'Angry', 'Focused', 'Happy']

    def extract_features(self, image_array):
        """Extract handwriting characteristics from image"""
        gray = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY) if len(image_array.shape) == 3 else image_array
        
        # Calculate slant angle
        slant_angle = self._calculate_slant_angle(gray)
        
        # Calculate letter size
        letter_size = self._calculate_letter_size(gray)
        
        # Calculate stroke width
        stroke_width = self._calculate_stroke_width(gray)
        
        # Calculate pressure (based on pixel intensity)
        pressure = self._calculate_pressure(gray)
        
        # Calculate spacing (letter spacing consistency)
        spacing = self._calculate_spacing(gray)
        
        return {
            'slant_angle': slant_angle,
            'letter_size': letter_size,
            'stroke_width': stroke_width,
            'pressure': pressure,
            'spacing': spacing
        }

    def _calculate_slant_angle(self, image):
        """Calculate handwriting slant angle"""
        edges = cv2.Canny(image, 50, 150)
        lines = cv2.HoughLines(edges, 1, np.pi / 180, 100)
        
        if lines is None or len(lines) == 0:
            return 0
        
        angles = [(theta * 180 / np.pi) - 90 for rho, theta in [line[0] for line in lines[:10]]]
        return float(np.mean(angles)) if angles else 0

    def _calculate_letter_size(self, image):
        """Calculate average letter height"""
        _, thresh = cv2.threshold(image, 128, 255, cv2.THRESH_BINARY_INV)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return 0
        
        heights = []
        for cnt in contours:
            _, _, _, h = cv2.boundingRect(cnt)
            if h > 5:  # Filter out noise
                heights.append(h)
        
        return float(np.mean(heights)) if heights else 0

    def _calculate_stroke_width(self, image):
        """Calculate stroke thickness"""
        _, thresh = cv2.threshold(image, 128, 255, cv2.THRESH_BINARY_INV)
        return float(np.sum(thresh) / (255 * image.size) * 100) if image.size > 0 else 0

    def _calculate_pressure(self, image):
        """Calculate writing pressure from pixel intensity"""
        normalized = image / 255.0
        return float(np.mean(normalized) * 100)

    def _calculate_spacing(self, image):
        """Calculate consistency of letter spacing"""
        _, thresh = cv2.threshold(image, 128, 255, cv2.THRESH_BINARY_INV)
        
        # Find horizontal projections
        horizontal_projection = np.sum(thresh, axis=0)
        white_runs = np.where(horizontal_projection > 0)[0]
        
        if len(white_runs) == 0:
            return 0
        
        # Calculate spacing consistency
        gaps = np.diff(white_runs)
        gap_variance = float(np.std(gaps)) if len(gaps) > 1 else 0
        return gap_variance

    def predict_behavior_from_features(self, features):
        """Rule-based behavior prediction from features"""
        slant = features['slant_angle']
        size = features['letter_size']
        stroke = features['stroke_width']
        pressure = features['pressure']
        spacing = features['spacing']
        
        scores = {
            'Calm': 0.2,
            'Stressed': 0.2,
            'Angry': 0.2,
            'Focused': 0.2,
            'Happy': 0.2
        }
        
        # Adjust scores based on features
        if slant > 10 and size > 30:
            scores['Happy'] += 0.3
            scores['Focused'] += 0.1
        elif slant < -10 and size < 20:
            scores['Calm'] += 0.3
        elif stroke > 60 and pressure > 50:
            scores['Stressed'] += 0.2
            scores['Angry'] += 0.15
        elif stroke < 30 and spacing > 5:
            scores['Focused'] += 0.3
        else:
            scores['Calm'] += 0.2
        
        # Normalize scores
        total = sum(scores.values())
        if total > 0:
            scores = {k: v/total for k, v in scores.items()}
        
        # Get dominant behavior
        dominant = max(scores.items(), key=lambda x: x[1])
        
        analysis = self._get_analysis(dominant[0], features)
        
        return {
            'behavior': dominant[0],
            'confidence': float(dominant[1]),
            'scores': {k: float(v) for k, v in scores.items()},
            'analysis': analysis
        }

    def _get_analysis(self, behavior, features):
        """Generate behavioral analysis text"""
        analyses = {
            'Calm': f"Your handwriting shows calm characteristics with a slant of {features['slant_angle']:.1f}° and moderate letter size of {features['letter_size']:.1f}. The steady pressure indicates emotional stability.",
            'Stressed': f"Signs of stress detected. Letter size varies ({features['letter_size']:.1f}), stroke width is {features['stroke_width']:.1f}, suggesting tension or anxiety.",
            'Angry': f"Aggressive writing patterns detected with heavy pressure ({features['pressure']:.1f}%) and irregular spacing ({features['spacing']:.2f}). Consider relaxation techniques.",
            'Focused': f"Highly concentrated writing. Consistent letter size ({features['letter_size']:.1f}) and regular spacing ({features['spacing']:.2f}) show excellent control.",
            'Happy': f"Positive mood indicated by upward slant ({features['slant_angle']:.1f}°) and expansive letter size ({features['letter_size']:.1f}). Optimistic energy evident."
        }
        return analyses.get(behavior, "Analysis unavailable")

# Model Manager
class BehaviorDetectionModel:
    def __init__(self, model_path=None):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = HandwritingBehaviorCNN().to(self.device)
        self.feature_extractor = HandwritingFeatureExtractor()
        self.transform = transforms.Compose([
            transforms.Grayscale(num_output_channels=1),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5], std=[0.5])
        ])
        
        if model_path:
            self.load_model(model_path)
        else:
            self.model.eval()

    def load_model(self, path):
        """Load pre-trained model weights"""
        try:
            self.model.load_state_dict(torch.load(path, map_location=self.device))
            self.model.eval()
        except Exception as e:
            print(f"Could not load model: {e}. Using untrained model.")

    def predict(self, image_bytes):
        """Predict behavior from image bytes"""
        try:
            # Load image from bytes
            image = Image.open(io.BytesIO(image_bytes))
            image_array = np.array(image)
            
            # Extract features
            features = self.feature_extractor.extract_features(image_array)
            
            # Get rule-based prediction
            prediction = self.feature_extractor.predict_behavior_from_features(features)
            
            # Add feature details
            prediction.update({
                'slant_angle': features['slant_angle'],
                'avg_size': features['letter_size'],
                'stroke': features['stroke_width'],
                'pressure': features['pressure'],
                'spacing': features['spacing']
            })
            
            return prediction
        except Exception as e:
            print(f"Prediction error: {e}")
            return {
                'behavior': 'Unknown',
                'confidence': 0.0,
                'scores': {},
                'error': str(e)
            }

# Global model instance
_model = None

def get_model():
    """Singleton pattern for model loading"""
    global _model
    if _model is None:
        _model = BehaviorDetectionModel()
    return _model
