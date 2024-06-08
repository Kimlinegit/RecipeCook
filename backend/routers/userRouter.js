import express from "express";
import auth from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
    register,
    login,
    logout,
    getUserProfile,
    refreshToken,
    updateUserProfile,
    changePassword,
    getAllUsers,
    adminUpdateRoles,
    deleteUser
} from "../controllers/userController.js";


const UserRouter = express.Router();


UserRouter.post('/register', register);
UserRouter.post('/login', login);
UserRouter.get('/logout', logout);
UserRouter.get('/getAll', getAllUsers);
UserRouter.put('/update_profile', auth, updateUserProfile);
UserRouter.get('/get_profile', auth, getUserProfile);
UserRouter.delete('/:userId', auth, authAdmin, deleteUser);
// UserRouter.get('/:userId/get_profile', auth, getUserProfile);
// UserRouter.put('/:userId/update_profile', auth, updateUserProfile);
// UserRouter.put('/:userId/update_role', auth, authAdmin, adminUpdateRoles);
// UserRouter.put('/:userId/change_password', auth, changePassword);
// UserRouter.delete('/:userId/delete', auth, authAdmin, deleteUser);
// UserRouter.get('/refresh_token', refreshToken);
// UserRouter.get('/getAll', auth, authAdmin, getAllUsers);

export default UserRouter;