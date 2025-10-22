# -*- coding: utf-8 -*-

from sklearn.metrics import f1_score, precision_score, recall_score, accuracy_score, jaccard_score, hamming_loss, label_ranking_loss, coverage_error
import sklearn.metrics as metr
import numpy as np
import pandas as pd

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)


def evaluate_segmentation(y_predicted, y_true):
    """Evaluation metrics for pixel-level semantic segmentation."""
    
    micro_precision = precision_score(y_true, y_predicted, average='micro')
    macro_precision = precision_score(y_true, y_predicted, average='macro')
    weighted_precision = precision_score(y_true, y_predicted, average='weighted')
    
    micro_recall = recall_score(y_true, y_predicted, average='micro')
    macro_recall = recall_score(y_true, y_predicted, average='macro')
    weighted_recall = recall_score(y_true, y_predicted, average='weighted')
        
    macro_f1 = f1_score(y_true, y_predicted, average="macro")
    micro_f1 = f1_score(y_true, y_predicted, average="micro")
    weighted_f1 = f1_score(y_true, y_predicted, average="weighted")
        
    subset_accuracy = accuracy_score(y_true, y_predicted)
    
    iou_score = jaccard_score(y_true, y_predicted, average='macro')

    info = {
            "macroPrec": macro_precision,
            "microPrec": micro_precision,
            "weightPrec": weighted_precision,
            "macroRec": macro_recall,
            "microRec": micro_recall,
            "weightRec": weighted_recall,
            "macroF1": macro_f1,
            "microF1": micro_f1,
            "weightF1": weighted_f1,
            "subsetAcc": subset_accuracy,
            "IoU": iou_score
            }
    
    return info


def evaluate_multilabel(y_predicted, predicted_probs, y_true):
    """Evaluation metrics for multi-label classification."""
    
    micro_precision = precision_score(y_true, y_predicted, average='micro')
    macro_precision = precision_score(y_true, y_predicted, average='macro')
    sample_precision = precision_score(y_true, y_predicted, average='samples')
    
    micro_recall = recall_score(y_true, y_predicted, average='micro')
    macro_recall = recall_score(y_true, y_predicted, average='macro')
    sample_recall = recall_score(y_true, y_predicted, average='samples')
        
    macro_f1 = f1_score(y_true, y_predicted, average="macro")
    micro_f1 = f1_score(y_true, y_predicted, average="micro")
    sample_f1 = f1_score(y_true, y_predicted, average="samples")
        
    subset_accuracy = accuracy_score(y_true, y_predicted)

    hamming = hamming_loss(y_true, y_predicted)
    coverage = coverage_error(y_true, y_predicted)
    rank_loss = label_ranking_loss(y_true, y_predicted)

    info = {
            "macroPrec": macro_precision,
            "microPrec": micro_precision,
            "samplePrec": sample_precision,
            "macroRec": macro_recall,
            "microRec": micro_recall,
            "sampleRec": sample_recall,
            "macroF1": macro_f1,
            "microF1": micro_f1,
            "sampleF1": sample_f1,
            "HammingLoss": hamming,
            "subsetAcc": subset_accuracy,
            "coverageError": coverage,
            "rankLoss": rank_loss
            }
    return info


def confusion_matrix(ground_truth, predicted, labels):
    """Generate confusion matrix with additional statistics."""
    
    # Compute metrics
    cm = metr.confusion_matrix(ground_truth, predicted)
    f1_macro = metr.f1_score(ground_truth, predicted, average='macro')
    mean_precision = metr.recall_score(ground_truth, predicted, average='macro')
    overall_accuracy = metr.accuracy_score(ground_truth, predicted)
    user_accuracy = metr.precision_score(ground_truth, predicted, average=None)
    producer_accuracy = metr.recall_score(ground_truth, predicted, average=None)
    f1 = metr.f1_score(ground_truth, predicted, average=None)
    iou = metr.jaccard_score(ground_truth, predicted, average=None)
    mean_iou = metr.jaccard_score(ground_truth, predicted, average='macro')
      
    # Build confusion matrix with statistics
    rows, cols = cm.shape
    cm_with_stats = np.zeros((rows + 4, cols + 2))
    cm_with_stats[0:-4, 0:-2] = cm
    cm_with_stats[-3, 0:-2] = np.round(iou, 2)
    cm_with_stats[-2, 0:-2] = np.round(user_accuracy, 2)
    cm_with_stats[-1, 0:-2] = np.round(f1, 2)
    cm_with_stats[0:-4, -1] = np.round(producer_accuracy, 2)
    
    cm_with_stats[-4, 0:-2] = np.sum(cm, axis=0) 
    cm_with_stats[0:-4, -2] = np.sum(cm, axis=1)
    
    # Convert to list
    cm_list = cm_with_stats.tolist()
    
    # Build column headers
    column_headers = []
    column_headers.extend(labels)
    column_headers.append('Sum')
    column_headers.append('Recall')
    
    # Build row headers
    row_headers = []
    row_headers.extend(labels)
    row_headers.append('Sum')
    row_headers.append('IoU')
    row_headers.append('Precision')
    row_headers.append('F1-score')
    
    # Fill summary statistics
    idx = 0
    for sublist in cm_list:
        if idx == rows:
            sublist[-2] = 'mPA:'
            sublist[-1] = round(float(mean_precision), 2)
            cm_list[idx] = sublist
        elif idx == rows + 1:
            sublist[-2] = 'mIoU:'
            sublist[-1] = round(float(mean_iou), 2)
            cm_list[idx] = sublist
        elif idx == rows + 2:
            sublist[-2] = 'OA:'
            sublist[-1] = round(float(overall_accuracy), 2)
            cm_list[idx] = sublist
        elif idx == rows + 3:
            cm_list[idx] = sublist
            sublist[-2] = 'F1-macro:'
            sublist[-1] = round(float(f1_macro), 2)    
        idx += 1
    
    # Convert to DataFrame
    df = pd.DataFrame(np.array(cm_list))
    df.columns = column_headers
    df.index = row_headers
    
    return df


def format_confusion_matrix_multilabel(confusion_matrix, class_label, row_names, column_names):
    """Format confusion matrix as a pandas DataFrame for multi-label classification."""
    
    df_cm = pd.DataFrame(confusion_matrix, index=row_names, columns=column_names)
    df_cm.index.name = class_label
    
    return df_cm