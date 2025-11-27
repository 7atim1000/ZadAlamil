import Order from './order.model';
import Cart from '../cart/cart.model';
import {ICartPopulated} from '../cart/cart.interface';
import {IOrder} from './order.interface';

export const createOrderService = async (userId: string, shippingAddress: any) => {
    try {
        // Get user's cart items
        const cartItems = await Cart.find({ user: userId })
            .populate('product', 'name price images stock')
            .populate('category', 'name') as unknown as ICartPopulated[];

        if (!cartItems || cartItems.length === 0) {
            return { success: false, message: 'Cart is empty' };
        }

        // Calculate order items and total
        const orderItems = cartItems.map(item => ({
            product: item.product._id, // Now TypeScript knows _id exists
            quantity: item.quantity,
            price: item.price,
            total: item.total
        }));

        const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);

        // Create new order
        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await order.save();
        
        // Populate the order with product details
        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'name email')
            .populate('items.product', 'name price images');

        return {
            success: true,
            order: populatedOrder,
            message: 'Order created successfully'
        };


    } catch (error: any) {
        return { success: false, message: error.message };
    }
};


export const getUserOrdersService = async (userId: string) => {
    
    try {
      const orders = await Order.find({ user: userId })
        .populate('user', 'name email')
        // .populate('items.product', 'name price images vendor')
        .populate({
          path: 'items.product',
          select: 'name price productImg category vendor',
          populate: [
            {
              path: 'category',
              select: 'name'
            },
            {
              path: 'vendor',
              select: 'name businessName email phone'
            }
          ]
        })

        .sort({ createdAt: -1 });

      return { success: true, orders };

    } catch (error: any) {
      return { success: false, message: error.message };
    }
};


export const getOrderByIdService = async (orderId: string, userId: string) => {
    try {
      const order = await Order.findOne({ _id: orderId, user: userId })
        .populate('user', 'name email')
        // .populate('items.product', 'name price images category');
        .populate({
          path: 'items.product',
          select: 'name price productImg category vendor',
          populate: [
            {
              path: 'category',
              select: 'name'
            },
            {
              path: 'vendor',
              select: 'name businessName email phone'
            }
          ]
        });

      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      return { success: true, order };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
};



// For admin
export const getAllOrdersService = async (page: number = 1, limit: number = 10) => {
    try {
      const skip = (page - 1) * limit;

      const orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product', 'name price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalOrders = await Order.countDocuments();
      const totalPages = Math.ceil(totalOrders / limit);

      return { 
        success: true, 
        orders, 
        currentPage: page,
        totalPages,
        totalOrders 
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
};


// update order status for admin
export const updateOrderStatusService = async (orderId: string, status: IOrder['status']) => {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      ).populate('user', 'name email')
       .populate('items.product', 'name price');

      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      return { 
        success: true, 
        order,
        message: 'Order status updated successfully' 
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
};


// Update payment status 
export const updatePaymentStatusService = async (orderId: string, paymentStatus: IOrder['paymentStatus']) => {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus },
        { new: true }
      );

      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      return { 
        success: true, 
        order,
        message: 'Payment status updated successfully' 
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
};

// Cancel order 
export const  cancelOrderService = async (orderId: string, userId: string) => {
    try {
      const order = await Order.findOne({ _id: orderId, user: userId });

      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      // Check if order can be cancelled
      if (order.status !== 'pending') {
        return { 
          success: false, 
          message: 'Order cannot be cancelled at this stage' 
        };
      }

      order.status = 'cancelled';
      await order.save();

      return { 
        success: true, 
        order,
        message: 'Order cancelled successfully' 
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
};


// Get order statistics (for admin dashboard)
export const getOrderStatisticsService = async () => {
   
    try {
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: 'pending' });
      const completedOrders = await Order.countDocuments({ status: 'delivered' });
      const totalRevenue = await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      return {
        success: true,
        statistics: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        }
      };

    } catch (error: any) {
      return { success: false, message: error.message };
    }

};




