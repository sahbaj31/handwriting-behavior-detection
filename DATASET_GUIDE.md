# Dataset Management Guide

## Overview

The Dataset Management system allows you to organize, manage, and export handwriting samples for training and improving the behavior detection model.

## Dataset Organization

### Behavior Categories
- **Calm** (0): Composed, peaceful handwriting
- **Stressed** (1): Anxious, irregular patterns
- **Angry** (2): Aggressive, heavy pressure
- **Focused** (3): Precise, controlled writing
- **Happy** (4): Expansive, flowing strokes

### Directory Structure
\`\`\`
datasets/
├── Calm/
│   ├── calm_001.jpg
│   ├── calm_002.jpg
│   └── ...
├── Stressed/
├── Angry/
├── Focused/
├── Happy/
└── metadata/
    ├── dataset_001.json
    ├── dataset_002.json
    └── ...
\`\`\`

## Web Interface

### Creating a Dataset
1. Navigate to **Datasets** → **Create Dataset**
2. Enter dataset name and description
3. Select the behavior category
4. Upload images (supports batch upload)
5. Click "Create Dataset"

### Managing Datasets
1. Go to **Datasets** → **Manage Datasets**
2. View all created datasets with statistics
3. **Export**: Download dataset with labels.csv for training
4. **Delete**: Remove dataset (irreversible)

## Python API

### Basic Usage

\`\`\`python
from dataset_manager import DatasetManager

# Initialize manager
manager = DatasetManager(base_dir='datasets')

# Create dataset
dataset_id = manager.create_dataset(
    name='Calm Handwriting Set 1',
    behavior='Calm',
    description='Collection of calm handwriting samples'
)

# Add images
images = manager.add_images(dataset_id, [
    'path/to/image1.jpg',
    'path/to/image2.jpg',
    'path/to/image3.jpg'
])

# List all datasets
all_datasets = manager.list_datasets()

# Export dataset for training
export_info = manager.export_dataset(dataset_id, export_dir='exports')
print(f"Exported to: {export_info['export_dir']}")
print(f"Labels file: {export_info['labels_file']}")

# Delete dataset
manager.delete_dataset(dataset_id)
\`\`\`

## Preparing Data for Training

### Step 1: Create Datasets via Web UI
- Upload your handwriting samples
- Organize by behavior category
- Add meaningful descriptions

### Step 2: Export Datasets
- Click "Export" on dataset
- Downloads labels.csv and images folder

### Step 3: Structure for Training
\`\`\`
exports/
├── Calm_Handwriting_Set_1/
│   ├── calm_001.jpg
│   ├── calm_002.jpg
│   └── ...
└── Calm_Handwriting_Set_1_labels.csv
\`\`\`

### Step 4: Combine Multiple Datasets
\`\`\`python
import os
import shutil

# Combine multiple datasets into training folder
output_dir = 'datasets/training_images'
os.makedirs(output_dir, exist_ok=True)

# Copy all images
for source_dir in ['exports/Calm_Set_1', 'exports/Calm_Set_2', ...]:
    for file in os.listdir(source_dir):
        shutil.copy(os.path.join(source_dir, file), output_dir)

# Merge labels files
with open('datasets/labels.csv', 'w') as outf:
    for labels_file in ['exports/labels_1.csv', 'exports/labels_2.csv', ...]:
        with open(labels_file, 'r') as inf:
            outf.write(inf.read())
\`\`\`

### Step 5: Train Model
\`\`\`bash
python scripts/train_model.py
\`\`\`

## Best Practices

### Image Quality
- Use clear, well-lit photos of handwriting
- Avoid blurry or skewed images
- 224x224 pixels minimum resolution
- JPG or PNG format recommended

### Dataset Balance
- Aim for equal images per behavior class
- Minimum 50 images per category
- Ideal: 100+ images per category

### Labeling Accuracy
- Ensure correct behavior classification
- Double-check exports before training
- Document any special characteristics

### Storage
- Organize datasets by collection date
- Include metadata about data source
- Backup important datasets regularly

## Troubleshooting

### Export Not Working
- Check file permissions
- Ensure dataset has images
- Verify browser supports download

### Training Fails with New Dataset
- Check CSV format: `filename.jpg,label_index`
- Verify image paths are correct
- Ensure image format is compatible

### Memory Issues with Large Datasets
- Process datasets in batches
- Reduce image resolution
- Use data augmentation instead

## Advanced Usage

### Automated Dataset Creation
\`\`\`python
import glob
from dataset_manager import DatasetManager

manager = DatasetManager()

# Auto-create from folder structure
behaviors = ['Calm', 'Stressed', 'Angry', 'Focused', 'Happy']
for behavior in behaviors:
    dataset_id = manager.create_dataset(
        f'{behavior} Collection',
        behavior,
        f'Auto-imported {behavior} handwriting samples'
    )
    
    # Add all images from behavior folder
    image_paths = glob.glob(f'raw_data/{behavior}/*.jpg')
    manager.add_images(dataset_id, image_paths)
\`\`\`

### Monitoring Dataset Growth
\`\`\`python
manager = DatasetManager()
datasets = manager.list_datasets()

for dataset in datasets:
    print(f"{dataset['name']}: {dataset['image_count']} images")
    
total_images = sum(d['image_count'] for d in datasets)
print(f"Total: {total_images} images")
