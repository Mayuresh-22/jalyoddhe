import torch
import numpy as np
from torch import nn
import random

random.seed(0)
np.random.seed(0)
torch.manual_seed(0)

class Down(nn.Module):
    
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.maxpool = nn.MaxPool2d(2)
        
        # Main path with dropout for regularization
        self.conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Dropout2d(0.1), 
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True))
        
        self.residual = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=1),
            nn.BatchNorm2d(out_channels)
        ) if in_channels != out_channels else nn.Identity()


    def forward(self, x):
        x = self.maxpool(x)
        residual = self.residual(x)
        return self.conv(x) + residual


class Up(nn.Module):
    
    def __init__(self, in_channels, out_channels):
        super().__init__()

        self.up = nn.ConvTranspose2d(in_channels, in_channels // 2, 
                                     kernel_size=2, stride=2)
        
        self.attention = AttentionBlock(in_channels // 2, in_channels // 2)
        
        self.conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Dropout2d(0.1),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True))
        
        self.residual = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=1),
            nn.BatchNorm2d(out_channels)
        )


    def forward(self, x1, x2):
        x1 = self.up(x1)  
        
        x2 = self.attention(x2, x1)  
        
        x = torch.cat([x2, x1], dim=1)  
        residual = self.residual(x)
        return self.conv(x) + residual


class AttentionBlock(nn.Module):
    """Attention mechanism to focus on relevant features"""
    def __init__(self, F_g, F_l):
        super().__init__()
        F_int = F_g // 2
        
        self.W_g = nn.Sequential(
            nn.Conv2d(F_g, F_int, kernel_size=1, stride=1, padding=0, bias=True),
            nn.BatchNorm2d(F_int)
        )
        
        self.W_x = nn.Sequential(
            nn.Conv2d(F_l, F_int, kernel_size=1, stride=1, padding=0, bias=True),
            nn.BatchNorm2d(F_int)
        )
        
        self.psi = nn.Sequential(
            nn.Conv2d(F_int, 1, kernel_size=1, stride=1, padding=0, bias=True),
            nn.BatchNorm2d(1),
            nn.Sigmoid()
        )
        
        self.relu = nn.ReLU(inplace=True)
        

    def forward(self, x, g):
        g1 = self.W_g(g)
        x1 = self.W_x(x)
        psi = self.relu(g1 + x1)
        psi = self.psi(psi)
        return x * psi


class UNet(nn.Module):
    
    def __init__(self, input_bands=11, output_classes=11, hidden_channels=16):
        super(UNet, self).__init__()
        
        hidden_channels = 32  
        
        self.inc = nn.Sequential(
            nn.Conv2d(input_bands, hidden_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(hidden_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(hidden_channels, hidden_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(hidden_channels),
            nn.ReLU(inplace=True))
        
        self.down1 = Down(hidden_channels, 2*hidden_channels)      
        self.down2 = Down(2*hidden_channels, 4*hidden_channels)    
        self.down3 = Down(4*hidden_channels, 8*hidden_channels)    
        self.down4 = Down(8*hidden_channels, 16*hidden_channels)  

        
        self.up1 = Up(16*hidden_channels, 8*hidden_channels)       
        self.up2 = Up(8*hidden_channels, 4*hidden_channels)        
        self.up3 = Up(4*hidden_channels, 2*hidden_channels)        
        self.up4 = Up(2*hidden_channels, hidden_channels)          
        
        self.dsv4 = nn.Conv2d(8*hidden_channels, output_classes, kernel_size=1)
        self.dsv3 = nn.Conv2d(4*hidden_channels, output_classes, kernel_size=1)
        self.dsv2 = nn.Conv2d(2*hidden_channels, output_classes, kernel_size=1)
        self.dsv1 = nn.Conv2d(hidden_channels, output_classes, kernel_size=1)
        
        self.outc = nn.Conv2d(hidden_channels, output_classes, kernel_size=1)


    def forward(self, x):
        input_size = x.shape[2:]
        
        x1 = self.inc(x)         
        
        x2 = self.down1(x1)      
        x3 = self.down2(x2)      
        x4 = self.down3(x3)      
        x5 = self.down4(x4)      
        
        x6 = self.up1(x5, x4)    
        
        x7 = self.up2(x6, x3)    
    
        x8 = self.up3(x7, x2)    
        
        x9 = self.up4(x8, x1)    
        
        logits = self.outc(x9)
        
        if self.training:
            dsv4 = nn.functional.interpolate(self.dsv4(x6), size=input_size, 
                                            mode='bilinear', align_corners=False)
            dsv3 = nn.functional.interpolate(self.dsv3(x7), size=input_size, 
                                            mode='bilinear', align_corners=False)
            dsv2 = nn.functional.interpolate(self.dsv2(x8), size=input_size, 
                                            mode='bilinear', align_corners=False)
            dsv1 = self.dsv1(x9)
            
            return logits, dsv4, dsv3, dsv2, dsv1
        
        return logits