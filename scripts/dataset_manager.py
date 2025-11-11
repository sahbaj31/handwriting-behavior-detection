import os
import json
import shutil
from pathlib import Path
from datetime import datetime

class DatasetManager:
    """Manage handwriting behavior datasets"""
    
    def __init__(self, base_dir='datasets'):
        self.base_dir = base_dir
        self.ensure_directories()
    
    def ensure_directories(self):
        """Create necessary directories"""
        behaviors = ['Calm', 'Stressed', 'Angry', 'Focused', 'Happy']
        for behavior in behaviors:
            os.makedirs(os.path.join(self.base_dir, behavior), exist_ok=True)
        os.makedirs(os.path.join(self.base_dir, 'metadata'), exist_ok=True)
    
    def create_dataset(self, name: str, behavior: str, description: str = ''):
        """Create a new dataset"""
        dataset_id = datetime.now().isoformat()
        metadata = {
            'id': dataset_id,
            'name': name,
            'behavior': behavior,
            'description': description,
            'created_at': dataset_id,
            'image_count': 0,
            'images': []
        }
        
        metadata_path = os.path.join(self.base_dir, 'metadata', f'{dataset_id}.json')
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return dataset_id
    
    def add_images(self, dataset_id: str, image_paths: list):
        """Add images to a dataset"""
        metadata_path = os.path.join(self.base_dir, 'metadata', f'{dataset_id}.json')
        
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        behavior = metadata['behavior']
        behavior_dir = os.path.join(self.base_dir, behavior)
        
        added_images = []
        for image_path in image_paths:
            if os.path.exists(image_path):
                filename = os.path.basename(image_path)
                dest_path = os.path.join(behavior_dir, filename)
                shutil.copy2(image_path, dest_path)
                added_images.append(filename)
        
        metadata['images'].extend(added_images)
        metadata['image_count'] = len(metadata['images'])
        
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return added_images
    
    def export_dataset(self, dataset_id: str, export_dir='exports'):
        """Export dataset with labels file"""
        os.makedirs(export_dir, exist_ok=True)
        
        metadata_path = os.path.join(self.base_dir, 'metadata', f'{dataset_id}.json')
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        behavior = metadata['behavior']
        behavior_index = {'Calm': 0, 'Stressed': 1, 'Angry': 2, 'Focused': 3, 'Happy': 4}
        
        # Create labels file
        labels_file = os.path.join(export_dir, f'{metadata["name"]}_labels.csv')
        with open(labels_file, 'w') as f:
            for image in metadata['images']:
                f.write(f'{image},{behavior_index[behavior]}\n')
        
        # Copy images
        dataset_export_dir = os.path.join(export_dir, metadata['name'])
        os.makedirs(dataset_export_dir, exist_ok=True)
        
        source_dir = os.path.join(self.base_dir, behavior)
        for image in metadata['images']:
            src = os.path.join(source_dir, image)
            dst = os.path.join(dataset_export_dir, image)
            if os.path.exists(src):
                shutil.copy2(src, dst)
        
        return {
            'export_dir': dataset_export_dir,
            'labels_file': labels_file,
            'image_count': len(metadata['images'])
        }
    
    def list_datasets(self):
        """List all datasets"""
        metadata_dir = os.path.join(self.base_dir, 'metadata')
        datasets = []
        
        for file in os.listdir(metadata_dir):
            if file.endswith('.json'):
                with open(os.path.join(metadata_dir, file), 'r') as f:
                    datasets.append(json.load(f))
        
        return datasets
    
    def delete_dataset(self, dataset_id: str):
        """Delete a dataset"""
        metadata_path = os.path.join(self.base_dir, 'metadata', f'{dataset_id}.json')
        
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            
            # Delete images
            behavior = metadata['behavior']
            behavior_dir = os.path.join(self.base_dir, behavior)
            for image in metadata['images']:
                image_path = os.path.join(behavior_dir, image)
                if os.path.exists(image_path):
                    os.remove(image_path)
            
            # Delete metadata
            os.remove(metadata_path)
            return True
        return False

# Usage example
if __name__ == '__main__':
    manager = DatasetManager()
    
    # Create dataset
    dataset_id = manager.create_dataset('Test Calm Dataset', 'Calm', 'Sample calm handwriting')
    
    # Add images (you would provide actual image paths)
    # manager.add_images(dataset_id, ['path/to/image1.jpg', 'path/to/image2.jpg'])
    
    # List datasets
    datasets = manager.list_datasets()
    print(f'Total datasets: {len(datasets)}')
    
    # Export dataset
    # export_info = manager.export_dataset(dataset_id)
    # print(f'Exported to: {export_info["export_dir"]}')
