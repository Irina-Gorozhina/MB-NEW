import express from "express"
import * as Products from "../models/products.js"
const productItemController = express.Router()

productItemController.get("/product_item", (request, response) => {
    if (request.query.id) {
        // Load details of the selected product
        Products.getById(request.query.id).then(product => {
            // Render checkout page view with selected product
            response.render("product_item", { product })
        }).catch(error => {
            response.status(500).send("An error happened! " + error)
        })
    }
})

export default productItemController
