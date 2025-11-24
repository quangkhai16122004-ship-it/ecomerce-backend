const ProductService = require("../services/ProductService");

const CreateProduct = async (req, res) => {
    try{
        const {name, image, type,price, countInStock, rating,description} = req.body
        console.log("req.body", req.body)
        if(!name || !image || !type|| !price|| !countInStock|| !rating){
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin'
            })
        } 
        const result=await ProductService.CreateProduct(req.body)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    try{
        const productId = req.params.id
        const data = req.body
        if(!productId){
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin'
            })
        }
        const result=await ProductService.updateProduct(productId, data)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try{
        const ProductId = req.params.id
        if(!ProductId){
            return res.status(400).json({
                status: 'ERR',
                message: 'sp k tồn tại'
            })
        }
        const result=await ProductService.getDetailsProduct(ProductId)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    try{
        const productId = req.params.id
        if(!productId){
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin productId'
            })
        }
        const result=await ProductService.deleteProduct(productId)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try{
        const {limit, page, sort, filter} = req.query
        const result=await ProductService.getAllProduct(Number(limit)||8, Number(page)||0, sort, filter)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    CreateProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
}