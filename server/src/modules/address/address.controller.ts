import { Request, Response } from 'express' ;
import * as AddressService from './address.service' ;

export const getUserAddressesController = async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const result = await AddressService.getUserAddressService(userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
};

export const createAddressController = async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const addressData = req.body;

      const result = await AddressService.createAddressService(userId, addressData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAddressController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      const updateData = req.body;

      const result = await AddressService.updateAddressService(id, userId, updateData);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteAddressController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      const result = await AddressService.deleteAddressService(id, userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
};


export const setDefaultAddressController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      const result = await AddressService.setDefaultAddressService(id, userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
};


export const testAddressRoute = async (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Address route is working!',
    timestamp: new Date().toISOString()
  });
};

// Add to your routes


