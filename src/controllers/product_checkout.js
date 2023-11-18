import express from "express"
import * as Products from "../models/products.js"
import * as Orders from '../models/orders.js';

const productCheckoutController = express.Router()

productCheckoutController.get("/product_checkout", (request, response) => {
    if (request.query.id) {
        Products.getById(request.query.id).then(product => {
            response.render("product_checkout", { product, status: 'open' })
        }).catch(error => {
            response.status(500).send("An error happened! " + error)
        })
    }
})

productCheckoutController.post("/product_checkout", (request, response) => {
    if (request.body) {
        const formData = request.body
        const newOrder = Orders.newOrder(
            null,
            "pending",
            (new Date().toISOString().slice(0, 19).replace("T", " ")),
            formData.firstname,
            formData.lastname,
            '',
            formData.email,
            formData.country,
            formData.city,
            formData.address1,
            formData.state,
            formData.postcode,
            formData.count[0],
            formData.totalPrice[0],
            formData.product_id
        )

        Orders.create(newOrder).then(([order]) => {
            response.render("product_checkout", { order, status: 'created' })
        }).catch(error => {
            response.status(500).send("Failed to create order: " + error)
        })
    }
})


export default productCheckoutController
