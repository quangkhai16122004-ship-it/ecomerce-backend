const User = require("../models/UserModel");

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
            const createdUser = await User.create({
                name,
                email,
                password,
                confirmPassword,
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

module.exports = {
    CreateUser
}