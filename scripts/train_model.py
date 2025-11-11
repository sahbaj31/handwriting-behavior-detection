import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
import os
from PIL import Image
import numpy as np
import sys

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from model import HandwritingBehaviorCNN

class HandwritingDataset(Dataset):
    """Custom dataset for handwriting behavior classification"""
    
    def __init__(self, image_dir, labels_file, transform=None):
        self.image_dir = image_dir
        self.transform = transform
        self.image_files = []
        self.labels = []
        
        # Load labels from file
        if os.path.exists(labels_file):
            with open(labels_file, 'r') as f:
                for line in f:
                    img_file, label = line.strip().split(',')
                    self.image_files.append(img_file)
                    self.labels.append(int(label))
    
    def __len__(self):
        return len(self.image_files)
    
    def __getitem__(self, idx):
        img_path = os.path.join(self.image_dir, self.image_files[idx])
        
        try:
            image = Image.open(img_path).convert('L')  # Convert to grayscale
            
            if self.transform:
                image = self.transform(image)
            
            label = torch.tensor(self.labels[idx], dtype=torch.long)
            
            return image, label
        except Exception as e:
            print(f"Error loading image {img_path}: {e}")
            return torch.zeros((1, 224, 224)), torch.tensor(0, dtype=torch.long)

def train_model(image_dir, labels_file, epochs=10, batch_size=32, model_save_path='models/handwriting_model.pth'):
    """Train the handwriting behavior detection model"""
    
    # Check if CUDA is available
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Data transforms
    transform = transforms.Compose([
        transforms.Grayscale(num_output_channels=1),
        transforms.Resize((224, 224)),
        transforms.RandomRotation(10),
        transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5], std=[0.5])
    ])
    
    # Create dataset and dataloader
    dataset = HandwritingDataset(image_dir, labels_file, transform=transform)
    
    if len(dataset) == 0:
        print("No training data found. Please provide training images and labels file.")
        print("Expected structure:")
        print("  - image_dir: directory containing training images")
        print("  - labels_file: CSV file with format 'filename.jpg,label_index'")
        return
    
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    
    # Initialize model
    model = HandwritingBehaviorCNN().to(device)
    
    # Loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.1)
    
    # Training loop
    print(f"Starting training with {len(dataset)} images...")
    
    for epoch in range(epochs):
        model.train()
        total_loss = 0.0
        correct = 0
        total = 0
        
        for batch_idx, (images, labels) in enumerate(dataloader):
            images, labels = images.to(device), labels.to(device)
            
            # Forward pass
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            # Backward pass
            loss.backward()
            optimizer.step()
            
            # Statistics
            total_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
            
            if (batch_idx + 1) % 10 == 0:
                print(f"Epoch {epoch+1}/{epochs}, Batch {batch_idx+1}, Loss: {loss.item():.4f}")
        
        scheduler.step()
        
        avg_loss = total_loss / len(dataloader)
        accuracy = 100. * correct / total
        
        print(f"Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f}, Accuracy: {accuracy:.2f}%")
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(model_save_path) if os.path.dirname(model_save_path) else '.', exist_ok=True)
    
    # Save model
    torch.save(model.state_dict(), model_save_path)
    print(f"Model saved to {model_save_path}")
    
    return model

if __name__ == '__main__':
    # Example usage
    train_model(
        image_dir='datasets/training_images',
        labels_file='datasets/labels.csv',
        epochs=10,
        batch_size=32,
        model_save_path='models/handwriting_model.pth'
    )
