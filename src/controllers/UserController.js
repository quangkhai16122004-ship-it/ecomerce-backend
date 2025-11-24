const UserService = require("../services/UserService");
const jwtService = require("../services/JwtService");


const CreateUser = async (req, res) => {
    try{
        const {name, email, password,confirmPassword, phone} = req.body
        const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail=reg.test(email)
        if(!name || !email || !password|| !confirmPassword|| !phone){
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin'
            })
        } else if(!isCheckEmail){
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            })
        } else if(password !== confirmPassword){
            return res.status(400).json({
                status: 'ERR',
                message: 'Mật khẩu không khớp'
            })
        }
        const result=await UserService.CreateUser(req.body)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body
        const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail=reg.test(email)
        if(!email || !password){
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin'
            })
        } else if(!isCheckEmail){
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            })
        } 
        const result=await UserService.loginUser(req.body)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try{
        const userId = req.params.id
        const data = req.body
        if(!userId){
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin'
            })
        }
        const result=await UserService.updateUser(userId, data)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try{
        const userId = req.params.id
        if(!userId){
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin'
            })
        }
        const result=await UserService.deleteUser(userId)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try{
        const result=await UserService.getAllUser()
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try{
        const userId = req.params.id
        if(!userId){
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin'
            })
        }
        const result=await UserService.getDetailsUser(userId)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const refreshToken = async (req, res) => {
    try {
        const tokenHeader = req.headers.token;
        if (!tokenHeader) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu token'
            });
        }

        const token = tokenHeader.split(' ')[1];
        const result = await jwtService.refreshTokenJwtService(token);

        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Lỗi server'
        });
    }
}

module.exports = {
    CreateUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
}