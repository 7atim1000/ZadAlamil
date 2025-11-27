import { Request, Response } from 'express' ;
import * as VendorService from './vendor.service' ;
import { AddVendorRequest } from './vendor.interface';
import jwt from 'jsonwebtoken';


export const AddVendorController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, companyName, licenseNumber, phone } = req.body;

    // Create vendor data object
    const vendorData: AddVendorRequest = {
      name,
      email,
      companyName,
      licenseNumber,
      phone,
      // status: status || 'pending', // Default value if not provided
      // action: action !== undefined ? action : true // Default value if not provided
    };

    // Call the service to add vendor
    const result = await VendorService.AddVendorService(vendorData);

    // Send appropriate response based on service result
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        vendorId: result.vendorId,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }

  } catch (error: any) {
    console.log('Error in AddVendorController:', error.message);
    res.status(500).json({
      success: false, 
      message: 'Internal server error'
    });
  }
};


// export const GetVendorsController = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { status } = req.query;
    
//     let vendors;
    
//     if (status && ['PENDING', 'APPROVED', 'REJECTED', 'ONGOING'].includes(status as string)) {
//       vendors = await VendorService.GetVendorsByStatusService(status as string);
//     } else {
//       vendors = await VendorService.GetVendorsService();
//     }

//     res.status(200).json(vendors);

//   } catch (error: any) {
//     console.error('Error in GetVendorsController:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while fetching vendors'
//     });
//   }
// };

export const GetVendorsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    let vendors;

    if (status && ['PENDING', 'APPROVED', 'REJECTED', 'ONGOING'].includes(status as string)) {
      vendors = await VendorService.GetVendorsByStatusService(status as string);
    } else {
      vendors = await VendorService.GetVendorsService();
    }

    // Return proper response structure
    res.status(200).json({
      success: true,
      vendors: vendors, // Wrap the vendors array in a vendors property
      totalVendors: vendors.length,
      message: 'Vendors fetched successfully'
    });

  } catch (error: any) {
    console.error('Error in GetVendorsController:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching vendors'
    });
  }
};


export const loginVendor = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await VendorService.loginVendorService(email, password);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };



  export const logoutVendor = async (req: Request, res: Response) => {
    try {
      const vendorId = (req as any).vendor?.vendorId;
      
      const result = await VendorService.logoutVendorService(vendorId);

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


  export const getVendorProfile = async (req: Request, res: Response) => {
    try {
      const vendorId = (req as any).vendor?.vendorId;
      
      const result = await VendorService.getVendorProfileService(vendorId);

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


  export const registerVendor = async (req: Request, res: Response) => {
    try {
      const vendorData = req.body;

      // Validate required fields
      const requiredFields = ['name', 'email', 'password', 'phone' ];
      const missingFields = requiredFields.filter(field => !vendorData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const result = await VendorService.registerVendorService(vendorData);

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


  // get vendor Orders
  export const getVendorOrders = async (req: Request, res: Response) => {

    try {
      const vendorId = (req as any).vendor?.vendorId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const result = await VendorService.getVendorOrdersService(vendorId, page, limit, status);

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


   // Get vendor order statistics
  export const  getVendorOrderStats = async (req: Request, res: Response) => {
    try {
      const vendorId = (req as any).vendor?.vendorId;

      const result = await VendorService.getVendorOrderStatsService(vendorId);

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

  // Update status of orders
  export const updateVendorOrderStatus = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const vendorId = (req as any).vendor?.vendorId;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const result = await VendorService.updateVendorOrderStatusService(orderId, vendorId, status);

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


  // decode the JWT token and extract the vendorId:
export const getVendorOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const vendorId = (req as any).vendor.vendorId;

    console.log("🔍 Vendor ID from middleware:", vendorId);
    console.log("🔍 Order ID:", orderId);

    if (!vendorId) {
      return res.status(401).json({
        success: false,
        message: 'Vendor authentication required'
      });
    }

    const result = await VendorService.getVendorOrderByIdService(orderId, vendorId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error: any) {
    console.error('Error in getVendorOrderById controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

  


