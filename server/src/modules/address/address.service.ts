import Address from './address.model' ;
import { IAddress } from './address.interface';

export const getUserAddressService = async(userId: string) => {
    try {
        const addresses = await Address.find({ user: userId })
            .sort({ isDefault: -1, createdAt: -1 });

        return { success: true, addresses };

    } catch (error: any) {
        return { success: false, message: error.message };
    }
};



export const createAddressService = async(userId: string, addressData: Omit<IAddress, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => {
    try {
        // If this is set as default, unset other defaults
      if (addressData.isDefault) {
        await Address.updateMany(
          { user: userId, isDefault: true },
          { isDefault: false }
        );
      }

      const address = new Address({
        ...addressData,
        user: userId
      });

      await address.save();

      return { success: true, address };


    } catch (error: any) {
        return { success: false, message: error.message };
    }
};


export const updateAddressService = async (addressId: string, userId: string, updateData: Partial<IAddress>) => {
    try {
      // If setting as default, unset other defaults
      if (updateData.isDefault) {
        await Address.updateMany(
          { user: userId, isDefault: true },
          { isDefault: false }
        );
      }

      const address = await Address.findOneAndUpdate(
        { _id: addressId, user: userId },
        updateData,
        { new: true }
      );

      if (!address) {
        return { success: false, message: 'Address not found' };
      }

      return { success: true, address };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
};


export const  deleteAddressService = async (addressId: string, userId: string) => {
    try {
      const address = await Address.findOneAndDelete({ 
        _id: addressId, 
        user: userId 
      });

      if (!address) {
        return { success: false, message: 'Address not found' };
      }

      return { success: true, message: 'Address deleted successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
};


export const setDefaultAddressService = async (addressId: string, userId: string) => {
    
    try {
      // Unset all other defaults
      await Address.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false }
      );

      // Set new default
      const address = await Address.findOneAndUpdate(
        { _id: addressId, user: userId },
        { isDefault: true },
        { new: true }
      );

      if (!address) {
        return { success: false, message: 'Address not found' };
      }

      return { success: true, address };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
};