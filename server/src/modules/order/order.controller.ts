import { Request, Response } from 'express';
import * as OrderService from './order.service';

/////////For users
// create order
export const createOrderController = async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const { shippingAddress } = req.body;

      if (!shippingAddress) {
        return res.status(400).json({
          success: false,
          message: 'Shipping address is required'
        });
      }

      const result = await OrderService.createOrderService(userId, shippingAddress);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};

// get user order 
export const getUserOrdersController = async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const result = await OrderService.getUserOrdersService(userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};

// get user by Id 
export const getOrderByIdController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      const result = await OrderService.getOrderByIdService(id, userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};

///////////////////For Admin
// get all orders
export const getAllOrdersController = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await OrderService.getAllOrdersService(page, limit);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};

// Update order status for admin
export const updateOrderStatusController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const result = await OrderService.updateOrderStatusService(id, status);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};


/////////////////////
// update payment status
export const  updatePaymentStatusController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      if (!paymentStatus) {
        return res.status(400).json({
          success: false,
          message: 'Payment status is required'
        });
      }

      const result = await OrderService.updatePaymentStatusService(id, paymentStatus);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};


// cancel order 
export const cancelOrderController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      const result = await OrderService.cancelOrderService(id, userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};


export const getOrderStatisticsController = async (req: Request, res: Response) => {
    try {
      const result = await OrderService.getOrderStatisticsService();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};
