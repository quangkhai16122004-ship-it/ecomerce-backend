const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const {generalAccessToken, generalRefreshToken} = require("./JwtService");

const CreateUser =(newUser)=>{
    return new Promise( async(resolve, reject)=>{
        const {name, email, password,confirmPassword, phone} = newUser
        try {
            const checkUser= await User.findOne({
                email : email
            })
            if(checkUser !==null){
                resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại'
                })
            }
            const hash = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if(createdUser){
            resolve({
                status: 'OK',
                message: 'Tạo tài khoản thành công',
                data: createdUser
            })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser =(userLogin)=>{
    return new Promise( async(resolve, reject)=>{
        const { email, password} = userLogin
        try {
            const checkUser= await User.findOne({
                email : email
            })
            if(checkUser ===null){
                resolve({
                    status: 'ERR',
                    message: 'user không tồn tại'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if(!comparePassword){
                resolve({
                    status: 'ERR',
                    message: 'Mật khẩu không đúng'
                })
            }
            const access_tocken = await generalAccessToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_tocken = await generalRefreshToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_tocken,
                refresh_tocken
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser =(id, data)=>{
    return new Promise( async(resolve, reject)=>{
        try {
            const checkUser= await User.findOne({
                _id: id
            })

            if(checkUser ===null){
                resolve({
                    status: 'ERR',
                    message: 'user không tồn tại'
                })
            }

            const updatedUser= await User.findByIdAndUpdate(id, data,{new: true})
            console.log("updatedUser", updatedUser);
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser =(id)=>{
    return new Promise( async(resolve, reject)=>{
        try {
            const checkUser= await User.findOne({
                _id: id
            })

            if(checkUser ===null){
                resolve({
                    status: 'ERR',
                    message: 'user không tồn tại'
                })
            }

             await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'xóa SUCCESS',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser =(id)=>{
    return new Promise( async(resolve, reject)=>{
        try {
            const allUser= await User.find()
            resolve({
                status: 'OK',
                message: 'xóa SUCCESS',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser =(id)=>{
    return new Promise( async(resolve, reject)=>{
        try {
            const user= await User.findOne({
                _id: id
            })

            if(user ===null){
                resolve({
                    status: 'ERR',
                    message: 'user không tồn tại'
                })
            }

            resolve({
                status: 'OK',
                message: 'xóa SUCCESS',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    CreateUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser
}