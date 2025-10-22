import os
import json
import torch
import random
import numpy as np
from tqdm import tqdm
import rasterio
from os.path import dirname as up
from torch.utils.data import Dataset
import torchvision.transforms.functional as F

random.seed(0)
np.random.seed(0)
torch.manual_seed(0)

pos_weight = torch.Tensor([
    2.65263158, 27.91666667, 11.39285714, 18.82857143, 6.79775281,
    6.46236559, 0.60648148, 27.91666667, 22.13333333, 5.03478261,
    17.26315789, 29.17391304, 16.79487179, 12.88, 9.05797101
])

bands_mean = np.array([
    0.05197577, 0.04783991, 0.04056812, 0.03163572, 0.02972606, 0.03457443,
    0.03875053, 0.03436435, 0.0392113, 0.02358126, 0.01588816
]).astype('float32')

bands_std = np.array([
    0.04725893, 0.04743808, 0.04699043, 0.04967381, 0.04946782, 0.06458357,
    0.07594915, 0.07120246, 0.08251058, 0.05111466, 0.03524419
]).astype('float32')

dataset_path = os.path.join(up(up(up(__file__))), 'data')


class MultiLabelDataset(Dataset):
    def __init__(self, mode='train', transform=None, standardization=None, 
                 path=dataset_path, agg_to_water=True):
        
        if mode == 'train':
            self.ROIs = np.genfromtxt(os.path.join(path, 'splits', 'train_X.txt'), dtype='str')
        elif mode == 'test':
            self.ROIs = np.genfromtxt(os.path.join(path, 'splits', 'test_X.txt'), dtype='str')
        elif mode == 'val':
            self.ROIs = np.genfromtxt(os.path.join(path, 'splits', 'val_X.txt'), dtype='str')
        else:
            raise ValueError(f"Invalid mode: {mode}. Must be 'train', 'test', or 'val'")
            
        self.images = []
        self.labels = []
        
        with open(os.path.join(path, 'labels_mapping.txt'), 'r') as f:
            label_mapping = json.load(f)

        if agg_to_water:
            for key in label_mapping.keys():
                if any([label_mapping[key][i] == 1 for i in [11, 12, 13, 14]]):
                    label_mapping[key][6] = 1
                label_mapping[key] = label_mapping[key][:-4]
            
        for roi in tqdm(self.ROIs, desc=f'Loading {mode} set'):
            roi_folder = '_'.join(['S2'] + roi.split('_')[:-1])
            roi_name = '_'.join(['S2'] + roi.split('_'))
            roi_file = os.path.join(path, 'patches', roi_folder, roi_name + '.tif')
            
            with rasterio.open(roi_file) as ds:
                image_data = ds.read()
            
            self.images.append(np.copy(image_data))
            self.labels.append(label_mapping[roi_name + '.tif'])

        if len(self.images) > 0:
            self.impute_nan = np.tile(bands_mean, (self.images[0].shape[1], self.images[0].shape[2], 1))
        else:
            self.impute_nan = np.tile(bands_mean, (256, 256, 1))
        self.mode = mode
        self.transform = transform
        self.standardization = standardization
        self.length = len(self.labels)
        self.path = path
        
    def __len__(self):
        return self.length
    
    def getnames(self):
        return self.ROIs
    
    def __getitem__(self, index):
        image = self.images[index]
        label = self.labels[index]
        label = torch.tensor(label).float()

        image = np.moveaxis(image, [0, 1, 2], [2, 0, 1]).astype('float32')
        
        nan_mask = np.isnan(image)
        image[nan_mask] = self.impute_nan[nan_mask]
        
        if self.transform is not None:
            image = image.astype('float32')
            image = self.transform(image)

        if self.standardization is not None:
            image = self.standardization(image)
            
        return image, label


class RandomRotationTransform:
    def __init__(self, angles):
        self.angles = angles

    def __call__(self, x):
        angle = random.choice(self.angles)
        return F.rotate(x, angle)


def gen_weights(pos_weight, c=1.4):
    return 1 / torch.log(c + pos_weight)
