import Cart from './cart.model' ;
import { ICart } from './cart.interface';

export const getCartByUserService = async(userId: string) => {
    
    try {
      const cartItems = await Cart.find({user: userId})
      .populate('user', 'name email')
      .populate('product', 'name price productImg qty')
      .populate('category', 'name');      

      return { success: true, cartItems };

    } catch (error: any) {
        return{ success: false, message: error.messsage };
    }
};


export const AddItemToCartService = async (cartData: Partial<ICart>) => {
    try {
        const existingCartItem= await Cart.findOne({
            user: cartData.user,
            product: cartData.product
        });
        if (existingCartItem) {
            existingCartItem.quantity += cartData.quantity || 1;
            existingCartItem.total = existingCartItem.price * existingCartItem.quantity;
            await existingCartItem.save();
            return { success: true, cartItem: existingCartItem };
        }

        const cartItem = new Cart(cartData);
        await cartItem.save();

        const populatedCartItem = await Cart.findById(cartItem._id)
            .populate('user', 'name email')
            .populate('product', 'name price images')
            .populate('category', 'name');

            return { success: true, cartItem: populatedCartItem };

    } catch (error: any) {
        return{ success: false, message: error.message}
    }
};

// Update cart item quantity
export const UpdateCartItemService = async (cartItemId: string, quantity: number) => {
  try {
    const cartItem = await Cart.findById(cartItemId);
    if (!cartItem) {
      return { success: false, message: 'Cart item not found' };
    }

    cartItem.quantity = quantity;
    cartItem.total = cartItem.price * quantity;
    await cartItem.save();

    return { success: true, cartItem };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};


// Remove item from cart
export const RemoveFromCartService = async (cartItemId: string) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(cartItemId);
    if (!cartItem) {
      return { success: false, message: 'Cart item not found' };
    }

    return { success: true, message: 'Item removed from cart' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};


// Clear user's entire cart
export const ClearCartService = async (userId: string) => {
  try {
    await Cart.deleteMany({ user: userId });
    return { success: true, message: 'Cart cleared successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Get cart summary (total items, total price)
export const GetCartSummaryService = async (userId: string) => {
  try {
    const cartItems = await Cart.find({ user: userId });
    
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);

    return { 
      success: true, 
      summary: { totalItems, totalPrice } 
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};