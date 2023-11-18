import express from "express"
import * as Products from "../models/products.js"
const homeController = express.Router()

homeController.get("/home", (request, response) => {
    Products.getAll().then(products => {
        response.status(200).render("home", { products: products.slice(0, 3) })
    }).catch(error => {
        response.status(500).send("An error happened! " + error)
    })
})

export default homeController
