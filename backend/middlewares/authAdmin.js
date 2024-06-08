import User from "../models/userModel.js";


const authAdmin = async (req, res, next) => {
    try {

        // Kiểm tra xem req.user có tồn tại không?
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized access!" });
        }

        //Lấy thông tin người dùng theo Id
        const user = await User.findOne({
            _id: req.user.id
        })

        //Kiểm tra quyền Admin
        if (user.role === "user") {
            return res.status(400).json({ message: "Admin resources access denied!" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default authAdmin;