import express from "express"
import bcrypt from "bcryptjs";
import * as Order from "../models/orders.js";
import * as Product from "../models/products.js";
import access_control from "../access_control.js";
import * as Changelog from "../models/changelog.js";
import validator from "validator";

const adminOrdersController = express.Router();

adminOrdersController.get("/admin_orders",
    access_control(["admin","stock", "sales" ]),
    (request, response) => {
        const editID = request.query.edit_id;
        if (editID) {
            Promise.all([
                Product.getAll(),
                Order.getById(editID),
                Order.getAll()
            ]).then(([allProducts,editItem, allItems]) => {
                response.status(200).render("admin_orders", {
                    allProducts,
                    allItems,
                    editItem,
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        } else {
            Promise.all([
                Product.getAll(),
                Order.getAll()
            ]).then(([allProducts, allItems]) => {
                response.status(200).render("admin_orders", {
                    allProducts,
                    allItems,
                    editItem: {
                        id: 0,
                        status: 'pending',
                        datetime: '',
                        customer_first_name: '',
                        customer_last_name: '',
                        customer_phone: '',
                        customer_email: '',
                        customer_country: '',
                        customer_city: '',
                        customer_address: '',
                        customer_state: '',
                        customer_post_code: '',
                        count: '',
                        total_price: '',
                        product_id: '',
                    },
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        }
    })

adminOrdersController.post("/admin_orders",
    access_control(["admin","stock", "sales" ]),
    (request, response) => {
        const formData = request.body;
        const editModel = Order.newOrder(
            formData.id,
            formData.status,
            formData.datetime,
            formData.customer_first_name || "",
            formData.customer_last_name ||"",
            formData.customer_phone ||"",
            formData.customer_email ||"" ,
            formData.customer_country ||"",
            formData.customer_city ||"",
            formData.customer_address||"" ,
            formData.customer_state||"" ,
            formData.customer_post_code ||"",
            formData.count,
            formData.total_price,
            formData.product_id,
        )

        const userUpdateChangelogEntry = Changelog.newChangelog(
            null,
            null,
            request.session.user.username,
            "User " + formData.action + "d order with id " + editModel.id,
            request.session.user.staffID,
            -1,
        )
        Changelog.create(userUpdateChangelogEntry).catch(error => {
            console.log(error)
            console.log("Failed to add to change log: " + userUpdateChangelogEntry);
        })

        if (formData.action == "create") {
            Order.create(editModel).then(() => {
                response.redirect("/admin_orders");
            });
        } else if (formData.action == "update") {
            Order.update(editModel).then(() => {
                response.redirect("/admin_orders");
            });
        } else if (formData.action == "delete") {
            Order.deleteById(editModel.id).then(() => {
                response.redirect("/admin_orders");
            });
        }
    })

export default adminOrdersController;
