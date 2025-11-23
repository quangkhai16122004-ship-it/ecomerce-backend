const UserService = require("../services/UserService");

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

module.exports = {
    CreateUser
}