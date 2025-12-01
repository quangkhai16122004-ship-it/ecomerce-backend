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

const getAllProduct =(limit, page, sort, filter)=>{
    return new Promise( async(resolve, reject)=>{
        try {
            const totalProduct= await Product.countDocuments()
            if(filter){
                const label=filter[0]
                const allobjectFilter= await Product.find({[label] : {'$regex': filter[1]}}).limit(limit).skip(page * limit)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allobjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),  
                    totalPage: Math.ceil(totalProduct/limit)
                    })
            }
            if(sort){
                const objectSort={}
                objectSort[sort[1]]=sort[0]
                console.log('objectSort', objectSort)
                const allProductsort= await Product.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allProductsort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),  
                    totalPage: Math.ceil(totalProduct/limit)
                    })
            }
            const allProduct= await Product.find().limit(limit).skip(page * limit)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1), 
                totalPage: Math.ceil(totalProduct/limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    CreateProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct
}