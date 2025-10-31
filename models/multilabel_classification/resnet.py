import torch
import torch.nn as nn
from torchvision import models


class AttentionBlock(nn.Module):
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


class ResNet(nn.Module):
    def __init__(self, input_bands: int = 11, output_classes: int = 11,
                 pretrained: bool = True, dropout: float = 0.4):
        super().__init__()

        resnet = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2 if pretrained else None)

        old_conv = resnet.conv1
        new_conv = nn.Conv2d(input_bands, old_conv.out_channels,
                             kernel_size=old_conv.kernel_size,
                             stride=old_conv.stride,
                             padding=old_conv.padding,
                             bias=old_conv.bias)

        if pretrained:
            with torch.no_grad():
                # Copy existing 3-channel weights
                new_conv.weight[:, :3, :, :] = old_conv.weight
                # Average remaining channels from RGB weights
                mean_w = old_conv.weight.mean(dim=1, keepdim=True)
                new_conv.weight[:, 3:, :, :] = mean_w.repeat(1, input_bands - 3, 1, 1)
        resnet.conv1 = new_conv

        self.encoder = nn.Sequential(
            resnet.conv1,
            resnet.bn1,
            resnet.relu,
            resnet.maxpool,
            resnet.layer1,
            resnet.layer2,
            resnet.layer3,
            resnet.layer4
        )

        self.attention = AttentionBlock(F_g=2048, F_l=2048)

        self.pool = nn.AdaptiveAvgPool2d(1)
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Sequential(
            nn.Linear(2048, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(512, output_classes)
        )

        self._init_weights()

    def _init_weights(self):
        for m in [self.fc, self.attention]:
            for name, param in m.named_parameters():
                if "weight" in name and param.dim() > 1:
                    nn.init.kaiming_normal_(param, mode='fan_out', nonlinearity='relu')
                elif "bias" in name:
                    nn.init.constant_(param, 0.0)

    def forward(self, x):
        x = self.encoder(x)
        x = self.attention(x, x)
        x = self.pool(x)
        x = torch.flatten(x, 1)
        x = self.dropout(x)
        logits = self.fc(x)
        return logits
