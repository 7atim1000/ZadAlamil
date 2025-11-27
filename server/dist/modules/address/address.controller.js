"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAddressRoute = exports.setDefaultAddressController = exports.deleteAddressController = exports.updateAddressController = exports.createAddressController = exports.getUserAddressesController = void 0;
const AddressService = __importStar(require("./address.service"));
const getUserAddressesController = async (req, res) => {
    try {
        const userId = req.user?._id;
        const result = await AddressService.getUserAddressService(userId);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserAddressesController = getUserAddressesController;
const createAddressController = async (req, res) => {
    try {
        const userId = req.user?._id;
        const addressData = req.body;
        const result = await AddressService.createAddressService(userId, addressData);
        if (result.success) {
            res.status(201).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createAddressController = createAddressController;
const updateAddressController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const updateData = req.body;
        const result = await AddressService.updateAddressService(id, userId, updateData);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateAddressController = updateAddressController;
const deleteAddressController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const result = await AddressService.deleteAddressService(id, userId);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteAddressController = deleteAddressController;
const setDefaultAddressController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const result = await AddressService.setDefaultAddressService(id, userId);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.setDefaultAddressController = setDefaultAddressController;
const testAddressRoute = async (req, res) => {
    res.json({
        success: true,
        message: 'Address route is working!',
        timestamp: new Date().toISOString()
    });
};
exports.testAddressRoute = testAddressRoute;
// Add to your routes
