import express from 'express'
import userRouter from '../modules/users/user.route';
import adminRoute from '../modules/admin/admin.route';
import vendorRoute from '../modules/vendor/vendor.route'
const router = express.Router();

router.use('/user', userRouter);
router.use('/admin', adminRoute);
router.use('/vendor', vendorRoute);


export default router ;