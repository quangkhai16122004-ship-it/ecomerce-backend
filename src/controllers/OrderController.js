const OrderService = require("../services/OrderService");

const CreateOrder = async (req, res) => {
    try{
        const {
            orderItems, // THÊM: Danh sách sản phẩm
            paymentMethod, 
            itemsPrice, 
            shippingPrice, 
            totalPrice, 
            fullName, 
            address, 
            city, 
            phone,
            user, // THÊM: ID người dùng
            deliveryMethod // THÊM: Phương thức giao hàng
        } = req.body

         console.log("req.body", req.body) // Bỏ comment để debug nếu cần

        // CẬP NHẬT LOGIC KIỂM TRA THÔNG TIN BẮT BUỘC
        if(
            !orderItems || orderItems.length === 0 || // Kiểm tra danh sách sản phẩm
            !user || // Kiểm tra ID người dùng
            !paymentMethod || 
            !itemsPrice || 
            !shippingPrice ===undefined || 
            !totalPrice || 
            !fullName || 
            !address || 
            !city || 
            !phone ||
            !deliveryMethod // Kiểm tra phương thức giao hàng
        ){
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin bắt buộc hoặc giỏ hàng trống'
            })
        } 
        
        const result = await OrderService.CreateOrder(req.body)
        return res.status(200).json(result)
    } catch (e) {
        // Nên log lỗi chi tiết ra console server
        console.error("Lỗi khi tạo đơn hàng:", e) 
        return res.status(404).json({
            status: 'ERR',
            message: e.message // Truyền message của lỗi để dễ debug hơn
        })
    }
}
const GetAllOrder = async (req, res) => {
    try {
        // Gọi hàm service vừa tạo trong Canvas
        const result = await OrderService.GetAllOrder(); 
        return res.status(200).json(result);
    } catch (e) {
        console.error("Lỗi khi lấy tất cả đơn hàng:", e);
        return res.status(404).json({
            status: 'ERR',
            message: e.message
        });
    }
};

module.exports = {
    CreateOrder,
    GetAllOrder
}