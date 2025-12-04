const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// const authMiddleware = (req, res, next) => {
//     const token = req.headers.token.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
//         if (err) {
//             return res.status(404).json({
//                 Message: 'The authentication',
//                 status: 'ERR',
//             })
//         }
//         const {payload} = user;
//         if(user?.isAdmin){
//             next();
//         } else{
//            return res.status(404).json({
//                 Message: 'The authentication',
//                 status: 'ERR',
//             })
//         }

//     });
// }

const authMiddleware = (req, res, next) => {
    // ✅ KIỂM TRA TOKEN TỒN TẠI
    if (!req.headers.token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERR',
        })
    }

    // ✅ KIỂM TRA ĐỊNH DẠNG TOKEN
    const tokenParts = req.headers.token.split(' ');
    if (tokenParts.length !== 2) {
        return res.status(401).json({
            message: 'Invalid token format. Use: Bearer <token>',
            status: 'ERR',
        })
    }

    const token = tokenParts[1];
    
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Invalid or expired token',
                status: 'ERR',
            })
        }

        // ✅ KIỂM TRA QUYỀN ADMIN
        if (user?.isAdmin) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({
                message: 'Admin access required',
                status: 'ERR',
            })
        }
    });
}

const authUserMiddleware = (req, res, next) => {
    // ✅ KIỂM TRA TOKEN TỒN TẠI TRƯỚC KHI SPLIT
    if (!req.headers.token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERR',
        })
    }
console.log('req.params.id', req.params.id)
    // ✅ KIỂM TRA ĐỊNH DẠNG TOKEN (có "Bearer " không)
    const tokenParts = req.headers.token.split(' ');
    if (tokenParts.length !== 2) {
        return res.status(401).json({
            message: 'Invalid token format. Use: Bearer <token>',
            status: 'ERR',
        })
    }

    const token = tokenParts[1]; // Lấy phần token sau "Bearer"
    
    // ✅ KIỂM TRA USER ID TRONG PARAMS
    const userId = req.params.id;
    // if (!userId) {
    //     return res.status(400).json({
    //         message: 'User ID is required in URL parameters',
    //         status: 'ERR',
    //     })
    // }

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Invalid or expired token',
                status: 'ERR',
            })
        }

        // ✅ KIỂM TRA QUYỀN TRUY CẬP
        if (user?.isAdmin || user?.id === req.params.id) {
            req.user = user; // Lưu thông tin user vào request
            next();
        } else {
            return res.status(403).json({
                message: 'Not authorized to update this user',
                status: 'ERR',
            })
        }
    });
}


module.exports = {
    authMiddleware,
    authUserMiddleware
}