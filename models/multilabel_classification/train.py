import os
import sys
import random
import logging
import numpy as np
from tqdm import tqdm
from os.path import dirname as up

import torch
import torchvision.transforms as transforms
from torch.utils.data import DataLoader

sys.path.append(up(os.path.abspath(__file__)))
from resnet import ResNet
from dataloader import MultiLabelDataset, bands_mean, bands_std, RandomRotationTransform, pos_weight, gen_weights

sys.path.append(os.path.join(up(up(up(os.path.abspath(__file__)))), 'utils'))
from metrics import evaluate_multilabel

root_path = up(up(up(os.path.abspath(__file__))))

logging.basicConfig(
    filename=os.path.join(root_path, 'logs', 'log_resnet.log'),
    filemode='a',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logging.info('='*50)

def set_seed(seed=0):
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.cuda.manual_seed(seed)
    np.random.seed(seed)
    random.seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
    
def seed_worker(worker_id):
    worker_seed = torch.initial_seed() % 2**32
    np.random.seed(worker_seed)
    random.seed(worker_seed)


def main(options):
    set_seed(0)
    
    transform_train = transforms.Compose([
        transforms.ToTensor(),
        RandomRotationTransform([-90, 0, 90, 180]),
        transforms.RandomHorizontalFlip()
    ])
    transform_test = transforms.Compose([transforms.ToTensor()])
    standardization = transforms.Normalize(bands_mean, bands_std)
    
    if options['mode'] == 'train':
        dataset_train = MultiLabelDataset('train', transform=transform_train, 
                                         standardization=standardization, 
                                         agg_to_water=options['agg_to_water'])
        dataset_val = MultiLabelDataset('val', transform=transform_test, 
                                       standardization=standardization, 
                                       agg_to_water=options['agg_to_water'])
                
        train_loader = DataLoader(dataset_train, batch_size=options['batch_size'], 
                                shuffle=True, num_workers=0, worker_init_fn=seed_worker)
        val_loader = DataLoader(dataset_val, batch_size=options['batch_size'], 
                              shuffle=False, num_workers=0, worker_init_fn=seed_worker)
        
    elif options['mode'] == 'test':
        dataset_test = MultiLabelDataset('test', transform=transform_test, 
                                        standardization=standardization, 
                                        agg_to_water=options['agg_to_water'])
        test_loader = DataLoader(dataset_test, batch_size=options['batch_size'], 
                               shuffle=False, num_workers=0, worker_init_fn=seed_worker)
    else:
        raise ValueError(f"Invalid mode: {options['mode']}. Must be 'train' or 'test'")
                        
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logging.info(f"Using device: {device}")
    
    model = ResNet(input_bands=options['input_channels'], 
                   output_classes=options['output_channels'])
    model.to(device)
    
    if options['resume_from_epoch'] > 0:
        resume_model_dir = os.path.join(options['checkpoint_path'], str(options['resume_from_epoch']))
        model_file = os.path.join(resume_model_dir, 'model.pth')
        logging.info(f'Loading model from: {model_file}')
        checkpoint = torch.load(model_file, map_location=device)
        model.load_state_dict(checkpoint)
        del checkpoint
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            
    global pos_weight
    if options['agg_to_water']:
        pos_weight = pos_weight[:-4]
            
    weight = gen_weights(1/pos_weight, c=options['weight_param'])
    criterion = torch.nn.BCEWithLogitsLoss(pos_weight=weight.to(device))
    optimizer = torch.optim.Adam(model.parameters(), lr=options['lr'], weight_decay=options['weight_decay'])

    if options['reduce_lr_on_plateau']:
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode='min', factor=0.2, patience=10)
    else:
        scheduler = torch.optim.lr_scheduler.MultiStepLR(
            optimizer, options['lr_steps'], gamma=0.2)

    start_epoch = options['resume_from_epoch'] + 1
    epochs = options['epochs']
    eval_every = options['eval_every']
    
    if options['mode'] == 'train':
        model.train()
        
        for epoch in range(start_epoch, epochs+1):
            train_loss_sum = 0.0
            train_samples = 0
            
            for images, targets in tqdm(train_loader, desc=f"Epoch {epoch}/{epochs}"):
                images = images.to(device)
                targets = targets.to(device)
    
                optimizer.zero_grad()
                logits = model(images)
                loss = criterion(logits, targets)
                loss.backward()
                optimizer.step()
    
                train_samples += targets.shape[0]
                train_loss_sum += loss.item() * targets.shape[0]
            
            avg_train_loss = train_loss_sum / train_samples
            logging.info(f"Epoch {epoch} - Training loss: {avg_train_loss:.4f}")
            
            if epoch % eval_every == 0 or epoch == 1:
                model.eval()
    
                val_loss_sum = 0.0
                val_samples = 0
                ground_truth = []
                predictions = []
                prediction_probs = []
                
                with torch.no_grad():
                    for images, targets in tqdm(val_loader, desc="Validating"):
                        images = images.to(device)
                        targets = targets.to(device)
    
                        logits = model(images)
                        loss = criterion(logits, targets)
                        
                        probs = torch.sigmoid(logits).cpu().numpy()
                        targets_np = targets.cpu().numpy()
                        
                        val_samples += targets_np.shape[0]
                        val_loss_sum += loss.item() * targets_np.shape[0]
                        prediction_probs.extend(probs)
                        ground_truth.extend(targets_np)
                        
                    prediction_probs = np.array(prediction_probs)
                    predictions = (prediction_probs >= options['threshold']).astype(np.float32)
                    ground_truth = np.array(ground_truth)
                    
                    metrics = evaluate_multilabel(predictions, prediction_probs, ground_truth)
                    avg_val_loss = val_loss_sum / val_samples
                    
                    logging.info(f"Epoch {epoch} - Validation loss: {avg_val_loss:.4f}")
                    logging.info(f"Metrics: {metrics}")
    
                    model_dir = os.path.join(options['checkpoint_path'], str(epoch))
                    os.makedirs(model_dir, exist_ok=True)
                    torch.save(model.state_dict(), os.path.join(model_dir, 'model.pth'))
                    logging.info(f"Model saved to {model_dir}")
    
                if options['reduce_lr_on_plateau']:
                    scheduler.step(avg_val_loss)
                else:
                    scheduler.step()
                    
                model.train()
                
    elif options['mode'] == 'test':
        model.eval()
        
        test_loss_sum = 0.0
        test_samples = 0
        ground_truth = []
        predictions = []
        prediction_probs = []
        
        with torch.no_grad():
            for images, targets in tqdm(test_loader, desc="Testing"):
                images = images.to(device)
                targets = targets.to(device)

                logits = model(images)
                loss = criterion(logits, targets)
                
                probs = torch.sigmoid(logits).cpu().numpy()
                targets_np = targets.cpu().numpy()
                
                test_samples += targets_np.shape[0]
                test_loss_sum += loss.item() * targets_np.shape[0]
                prediction_probs.extend(probs)
                ground_truth.extend(targets_np)
                    
            prediction_probs = np.array(prediction_probs)
            predictions = (prediction_probs >= options['threshold']).astype(np.float32)
            ground_truth = np.array(ground_truth)
            
            metrics = evaluate_multilabel(predictions, prediction_probs, ground_truth)
            avg_test_loss = test_loss_sum / test_samples
            
            logging.info(f"Test loss: {avg_test_loss:.4f}")
            logging.info(f"Test Metrics: {metrics}")


if __name__ == "__main__":
    options = {
        'agg_to_water': True,
        'mode': 'train',
        'epochs': 20,
        'batch_size': 32,
        'resume_from_epoch': 0,
        'input_channels': 11,
        'output_channels': 11,
        'weight_param': 1.6,
        'threshold': 0.5,
        'lr': 2e-4,
        'weight_decay': 1e-6,
        'reduce_lr_on_plateau': False,
        'lr_steps': [5, 10, 15],
        'checkpoint_path': os.path.join(up(os.path.abspath(__file__)), 'saved_models'),
        'eval_every': 1
    }
    
    logging.info(f'Starting training with options: {options}')
    main(options)
