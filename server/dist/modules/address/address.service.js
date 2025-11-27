"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultAddressService = exports.deleteAddressService = exports.updateAddressService = exports.createAddressService = exports.getUserAddressService = void 0;
const address_model_1 = __importDefault(require("./address.model"));
const getUserAddressService = async (userId) => {
    try {
        const addresses = await address_model_1.default.find({ user: userId })
            .sort({ isDefault: -1, createdAt: -1 });
        return { success: true, addresses };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getUserAddressService = getUserAddressService;
const createAddressService = async (userId, addressData) => {
    try {
        // If this is set as default, unset other defaults
        if (addressData.isDefault) {
            await address_model_1.default.updateMany({ user: userId, isDefault: true }, { isDefault: false });
        }
        const address = new address_model_1.default({
            ...addressData,
            user: userId
        });
        await address.save();
        return { success: true, address };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.createAddressService = createAddressService;
const updateAddressService = async (addressId, userId, updateData) => {
    try {
        // If setting as default, unset other defaults
        if (updateData.isDefault) {
            await address_model_1.default.updateMany({ user: userId, isDefault: true }, { isDefault: false });
        }
        const address = await address_model_1.default.findOneAndUpdate({ _id: addressId, user: userId }, updateData, { new: true });
        if (!address) {
            return { success: false, message: 'Address not found' };
        }
        return { success: true, address };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.updateAddressService = updateAddressService;
const deleteAddressService = async (addressId, userId) => {
    try {
        const address = await address_model_1.default.findOneAndDelete({
            _id: addressId,
            user: userId
        });
        if (!address) {
            return { success: false, message: 'Address not found' };
        }
        return { success: true, message: 'Address deleted successfully' };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.deleteAddressService = deleteAddressService;
const setDefaultAddressService = async (addressId, userId) => {
    try {
        // Unset all other defaults
        await address_model_1.default.updateMany({ user: userId, isDefault: true }, { isDefault: false });
        // Set new default
        const address = await address_model_1.default.findOneAndUpdate({ _id: addressId, user: userId }, { isDefault: true }, { new: true });
        if (!address) {
            return { success: false, message: 'Address not found' };
        }
        return { success: true, address };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.setDefaultAddressService = setDefaultAddressService;
