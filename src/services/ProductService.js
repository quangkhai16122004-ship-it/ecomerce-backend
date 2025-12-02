const Product = require("../models/ProductModel");
const bcrypt = require('bcrypt');

const CreateProduct =(newProduct)=>{
    return new Promise( async(resolve, reject)=>{
        const {name, image, type,price, countInStock, rating,description} = newProduct
        try {
            const checkProduct= await Product.findOne({
                name : name
            })
            if(checkProduct !==null){
                resolve({
                    status: 'ERR',
                    message: 'ten san pham đã tồn tại'
                })
            }
            const createdProduct = await Product.create({
                name, image, type,price, countInStock, rating,description
            })
            if(createdProduct){
            resolve({
                status: 'OK',
                message: 'Tạo tài khoản thành công',
                data: createdProduct
            })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct =(id, data)=>{
    return new Promise( async(resolve, reject)=>{
        try {
            const checkProduct= await Product.findOne({
                _id: id
            })

            if(checkProduct ===null){
                resolve({
                    status: 'ERR',
                    message: 'Product không tồn tại'
                })
            }

            const updatedProduct= await Product.findByIdAndUpdate(id, data,{new: true})
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct =(id)=>{
    return new Promise( async(resolve, reject)=>{
        try {
            const checkProduct= await Product.findOne({
                _id: id
            })

            if(checkProduct ===null){
                resolve({
                    status: 'ERR',
                    message: 'Product không tồn tại'
                })
            }

             await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'xóa Product SUCCESS',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!Array.isArray(ids) || ids.length === 0) {
                resolve({
                    status: 'ERR',
                    message: 'Danh sách ids không hợp lệ'
                });
            }

            await Product.deleteMany({ _id: { $in: ids } });

            resolve({
                status: 'OK',
                message: 'Xoá nhiều sản phẩm thành công'
            });

        } catch (e) {
            reject(e);
        }
    });
};


const getDetailsProduct =(id)=>{
    return new Promise( async(resolve, reject)=>{
        try {
            const product= await Product.findOne({
                _id: id
            })

            if(product ===null){
                resolve({
                    status: 'ERR',
                    message: 'product không tồn tại'
                })
            }

            resolve({
                status: 'OK',
                message: 'xóa SUCCESS',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter, search) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. KHỞI TẠO CÁC ĐIỀU KIỆN
            let condition = {};
            let sortObject = {};
            let totalProduct;
            
            // --- XỬ LÝ TÌM KIẾM/LỌC (FILTER) ---
            // Frontend gửi: filter=['name', 'giá trị'] VÀ search='giá trị'
            if (filter && typeof filter === 'string' && search && search.trim() !== '') {
                
                // 'filter' là tên trường cần tìm (ví dụ: 'name')
                // 'search' là giá trị tìm kiếm (ví dụ: 't')
                condition = { 
                    [filter]: { 
                        '$regex': search, 
                        '$options': 'i' 
                    } 
                };
                
                // Đếm tổng số sản phẩm đã filter
                totalProduct = await Product.countDocuments(condition);
                
            } else {
                // Trường hợp 2: Không có tìm kiếm hợp lệ, đếm tổng tất cả sản phẩm
                totalProduct = await Product.countDocuments();
            } 
            
            // --- XỬ LÝ SẮP XẾP (SORT) ---
            if (sort) {
                // sort[0] là direction (1 hoặc -1), sort[1] là field ('price', 'rating')
                sortObject[sort[1]] = sort[0] === 'asc' ? 1 : -1;
                // Nếu Controller gửi đúng định dạng ['asc', 'price'] hoặc ['desc', 'price']
            }
            
            // --- THỰC HIỆN TRUY VẤN VÀ PHÂN TRANG ---
            
           const allProduct = await Product.find(condition) // Áp dụng điều kiện tìm kiếm
                .limit(limit)
                .skip(page * limit)
                .sort(sortObject); // Áp dụng sắp xếp

            const totalPage = Math.ceil(totalProduct / limit);
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProduct,
                total: totalProduct, // Tổng số sản phẩm sau khi filter
                pageCurrent: Number(page) + 1,
                totalPage: totalPage
            });
            
        } catch (e) {
            reject(e);
        }
    });
};

const getAllTypee = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allType,
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    CreateProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllTypee
}