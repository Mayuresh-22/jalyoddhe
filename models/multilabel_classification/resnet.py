import torch.nn as nn
from torchvision import models


class ResNet(nn.Module):
    def __init__(self, input_bands=11, output_classes=11):
        super().__init__()

        resnet = models.resnet50(weights=None)
        
        self.encoder = nn.Sequential(
            nn.Conv2d(input_bands, 64, kernel_size=(7, 7), stride=(2, 2), padding=(3, 3), bias=False),
            resnet.bn1,
            resnet.relu,
            resnet.maxpool,
            resnet.layer1,
            resnet.layer2,
            resnet.layer3,
            resnet.layer4,
            resnet.avgpool
        )
        
        self.fc = nn.Linear(2048, output_classes)

    def forward(self, x):
        x = self.encoder(x)
        x = x.view(x.size(0), -1)
        logits = self.fc(x)
        return logits
