import os
import sys
import json
import random
import logging
import numpy as np
from tqdm import tqdm
from os.path import dirname as up
from sklearn.metrics import multilabel_confusion_matrix, classification_report

import torch
import torchvision.transforms as transforms
from torch.utils.data import DataLoader

sys.path.append(up(os.path.abspath(__file__)))
from resnet import ResNet
from dataloader import MultiLabelDataset, bands_mean, bands_std

sys.path.append(os.path.join(up(up(up(os.path.abspath(__file__)))), 'utils'))
from metrics import evaluate_multilabel, format_confusion_matrix_multilabel
from assets import labels

random.seed(0)
np.random.seed(0)
torch.manual_seed(0)

root_path = up(up(up(os.path.abspath(__file__))))

logging.basicConfig(
    filename=os.path.join(root_path, 'logs', 'evaluating_resnet.log'),
    filemode='a',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logging.info('='*50)


def main(options):
    transform_test = transforms.Compose([transforms.ToTensor()])
    standardization = transforms.Normalize(bands_mean, bands_std)
    
    dataset_test = MultiLabelDataset('test', transform=transform_test, 
                                    standardization=standardization, 
                                    agg_to_water=options['agg_to_water'])
    
    test_loader = DataLoader(dataset_test, batch_size=options['batch_size'], shuffle=False)
    
    global labels
    if options['agg_to_water']:
        labels = labels[:-4]
                        
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logging.info(f"Using device: {device}")
    
    model = ResNet(input_bands=options['input_channels'], 
                   output_classes=options['output_channels'])
    model.to(device)
    
    model_file = options['model_path']
    logging.info(f'Loading model from: {model_file}')
    checkpoint = torch.load(model_file, map_location=device)
    model.load_state_dict(checkpoint)
    del checkpoint
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

    model.eval()

    ground_truth = []
    predictions = []
    prediction_probs = []
    
    with torch.no_grad():
        for images, targets in tqdm(test_loader, desc="Evaluating"):
            images = images.to(device)
            targets = targets.to(device)

            logits = model(images)
            probs = torch.sigmoid(logits).cpu().numpy()
            targets_np = targets.cpu().numpy()
            
            prediction_probs.extend(probs)
            ground_truth.extend(targets_np)
                
        prediction_probs = np.array(prediction_probs)
        predictions = (prediction_probs >= options['threshold']).astype(np.float32)
        ground_truth = np.array(ground_truth)
        
        output = {
            'S2_' + dataset_test.ROIs[i] + '.tif': predictions[i, :].tolist() 
            for i in range(predictions.shape[0])
        }
        with open(os.path.join(root_path, 'data', 'predicted_labels_mapping.txt'), 'w') as f:
            json.dump(output, f)
        
        metrics = evaluate_multilabel(predictions, prediction_probs, ground_truth)
        logging.info("Evaluation Metrics:")
        logging.info(str(metrics))
        print("Evaluation Metrics:", metrics)
        
        classification_rep = classification_report(
            ground_truth, predictions, target_names=labels, digits=4, output_dict=False
        )
        print(classification_rep)
        logging.info(classification_rep)
        
        confusion_matrices = multilabel_confusion_matrix(ground_truth, predictions)
        
        print("\nPer Label Confusion Matrix:")
        logging.info("\nPer Label Confusion Matrix:")
        
        for conf_matrix, label in zip(confusion_matrices, labels):
            df_cm = format_confusion_matrix_multilabel(
                conf_matrix, label, ["Not Assigned", "Assigned"], ["No", "Yes"]
            )
            print(df_cm.to_string() + '\n')
            logging.info(df_cm.to_string() + '\n')


if __name__ == "__main__":
    options = {
        'agg_to_water': True,
        'batch_size': 5,
        'threshold': 0.5,
        'input_channels': 11,
        'output_channels': 11,
        'model_path': os.path.join(up(os.path.abspath(__file__)), 'trained_models', '18', 'model.pth')
    }
    
    main(options)
