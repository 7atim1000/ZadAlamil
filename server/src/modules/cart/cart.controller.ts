import { Request, Response } from 'express' ;
import * as CartService from './cart.service';

// Get user's cart
export const GetUserCartController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id || req.body.user;
        const result = await CartService.getCartByUserService(userId);
        
        result.success 
        ? res.status(200).json(result)
        : res.status(404).json(result);

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message})
    }
};


// Add to cart
export const AddToCartController = async (req: Request, res: Response) => {
  try {
    const cartData = {
      ...req.body,
      user: req.user?._id || req.body.user,
      total: req.body.price * req.body.quantity
    };

    const result = await CartService.AddItemToCartService(cartData);
    
    result.success 
      ? res.status(201).json(result)
      : res.status(400).json(result);
      
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }

};


// Update cart item
export const UpdateCartItemController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const result = await CartService.UpdateCartItemService(id, quantity);
    
    result.success 
      ? res.status(200).json(result)
      : res.status(404).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from cart
export const RemoveFromCartController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CartService.RemoveFromCartService(id);
    
    result.success 
      ? res.status(200).json(result)
      : res.status(404).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Clear cart
export const ClearCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const result = await CartService.ClearCartService(userId);
    
    result.success 
      ? res.status(200).json(result)
      : res.status(400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get cart summary
export const GetCartSummaryController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const result = await CartService.GetCartSummaryService(userId);
    
    result.success 
      ? res.status(200).json(result)
      : res.status(400).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};