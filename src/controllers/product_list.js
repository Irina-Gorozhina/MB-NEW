import express from "express"
import * as Products from "../models/products.js"
const productListController = express.Router()

productListController.get("/product_list", (request, response) => {
    if (Object.keys(request.query).length !== 0) {
        const formData = request.query;
        const filterData = {
            min_price: formData.min_price || 0,
            max_price: formData.max_price || 100,
            brand: !!formData.brand ? typeof formData.brand === 'string' ? [formData.brand] : formData.brand : ['samsung', 'apple'],
            type: !!formData.brand ? typeof formData.type === 'string' ? [formData.type] : formData.type : ['smartphone', 'push-button'],
            search: formData.search || '',
        }
        Products.filter(filterData).then(products => {
            response.status(200).render("product_list", { products, filterData })
        }).catch(error => {
            response.status(500).send("An error happened! " + error)
        })
    } else {
        const defaultFilterData = {
            min_price: 0,
            max_price: 100,
            brand: ['samsung', 'apple'],
            type: ['smartphone', 'push-button'],
            search: '',
        }
        Products.getAll().then(products => {
            response.status(200).render("product_list", { products: products, filterData: defaultFilterData })
        }).catch(error => {
            response.status(500).send("An error happened! " + error)
        })
    }
})

export default productListController
