import {Product} from "../models/product.model.js";

export async function getProductById(req, res) {
    try{
        const {id} = req.params;
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}