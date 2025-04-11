import { Request, Response } from 'express';
import * as documentService from '../services/document.service';

interface DocumentResponse {
  documentId: string;
  orderId: number;
  filename: string;
  filePath: string;
  generatedAt: string;
  downloadUrl: string;
}

export const generateETransportDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      res.status(400).json({ error: 'invalid order id' });
      return;
    }
    
    const document = await documentService.generateETransportDocument(orderId) as DocumentResponse;
    
    // return document metadata with a download link
    res.status(201).json({
      ...document,
      message: 'e-transport document generated successfully',
      downloadUrl: `${req.protocol}://${req.get('host')}${document.filePath}`
    });
  } catch (error: any) {
    console.error('error generating etransport document:', error);
    res.status(500).json({ error: error.message || 'failed to generate etransport document' });
  }
};

export const generateEnvironmentDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      res.status(400).json({ error: 'invalid order id' });
      return;
    }
    
    const document = await documentService.generateEnvironmentDocument(orderId) as DocumentResponse;
    
    // return document metadata with a download link
    res.status(201).json({
      ...document,
      message: 'environment document generated successfully',
      downloadUrl: `${req.protocol}://${req.get('host')}${document.filePath}`
    });
  } catch (error: any) {
    console.error('error generating environment document:', error);
    res.status(500).json({ error: error.message || 'failed to generate environment document' });
  }
}; 