const Product = require("../models/ProductModel");
const Order = require("../models/OrderProduct");
const bcrypt = require('bcrypt');
const {generalAccessToken, generalRefreshToken} = require("./JwtService");

const CreateOrder =(newOrder)=>{
   return new Promise(async (resolve, reject) => {
        try {
            const { 
                orderItems, 
                paymentMethod, 
                itemsPrice, 
                shippingPrice, 
                totalPrice, 
                fullName, 
                address, 
                city, 
                phone, 
                user,
                deliveryMethod 
            } = newOrder;

            // 1. Kiểm tra tồn kho và cập nhật số lượng
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findById(order.product);
                
                if (productData.countInStock < order.amount) {
                    return {
                        status: 'ERR',
                        message: `Sản phẩm ${productData.name} chỉ còn ${productData.countInStock} sản phẩm trong kho.`,
                    };
                }
                
                await Product.findByIdAndUpdate(order.product, {
                    $inc: { countInStock: -order.amount } 
                }, { new: true });

                return { status: 'OK' };
            });

            const results = await Promise.all(promises);
            const isError = results.find((result) => result.status === 'ERR');

            if (isError) {
                return resolve(isError);
            }
            
            // 2. Tạo đơn hàng mới
            const CreatedOrder = await Order.create({
                orderItems,
                shippingAddress: { fullName, address, city, phone }, 
                paymentMethod,
                deliveryMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user: user,
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: CreatedOrder,
            });

        } catch (e) {
            console.error('Lỗi trong OrderService.CreateOrder:', e);
            reject(e);
        }
    });
}

const GetAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
                .sort({ createdAt: -1 })
                .populate('orderItems.product'); 
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allOrder,
            });
        } catch (e) {
            console.error('Lỗi trong OrderService.GetAllOrder:', e);
            reject(e);
        }
    });
}



module.exports = {
    CreateOrder,
    GetAllOrder
}