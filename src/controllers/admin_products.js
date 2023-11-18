import express from "express"
import bcrypt from "bcryptjs";
import * as Order from "../models/orders.js";
import * as Product from "../models/products.js";
import access_control from "../access_control.js";
import * as Changelog from "../models/changelog.js";
import validator from "validator";

const adminProductsController = express.Router();

adminProductsController.get("/admin_products",
    access_control(["admin", "stock", "sales"]),
    (request, response) => {
        const editID = request.query.edit_id;
        if (editID) {
            Promise.all([
                Product.getAll(),
                Product.getById(editID)
            ]).then(([allItems,editItem]) => {
                response.status(200).render("admin_products", {
                    allItems,
                    editItem,
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        } else {
            Promise.all([
                Product.getAll()
            ]).then(([allItems]) => {
                response.status(200).render("admin_products", {
                    allItems,
                    editItem: {
                        id: 0,
                        name: '',
                        stock: 0,
                        price: 0,
                        description: '',
                        brand: 'samsung',
                        type: 'smartphone'
                    },
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        }
    })

adminProductsController.post("/admin_products",
    access_control(["admin","stock", "sales" ]),
    (request, response) => {
        const formData = request.body;

        const editModel = Product.newProduct(
            formData.id,
            formData.name,
            formData.stock,
            formData.price,
            formData.description,
            formData.brand,
            formData.type,
            request.session.user.staffID,
        )

        const userUpdateChangelogEntry = Changelog.newChangelog(
            null,
            null,
            request.session.user.username,
            "User " + formData.action + "d product with id " + editModel.id,
            request.session.user.staffID,
            formData.id,
        )
        Changelog.create(userUpdateChangelogEntry).catch(error => {
            console.log(error);
            console.log("Failed to add to change log: " + userUpdateChangelogEntry);
        })

        if (formData.action == "create") {
            Product.create(editModel).then(() => {
                response.redirect("/admin_products");
            });
        } else if (formData.action == "update") {
            Product.update(editModel).then(() => {
                response.redirect("/admin_products");
            });
        } else if (formData.action == "delete") {
            Product.deleteById(editModel.id).then(() => {
                response.redirect("/admin_products");
            });
        }
    })

export default adminProductsController;
