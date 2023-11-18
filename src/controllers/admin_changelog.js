import express from "express";
import bcrypt from "bcryptjs";
import access_control from "../access_control.js";
import * as Users from './../models/staff.js';
import * as Changelog from "../models/changelog.js";
import * as Feature from "../models/feature.js"; 
import validator from "validator";
import {getAllFromProduct} from "../models/changelog.js";

const adminChangelogController = express.Router();

adminChangelogController.get("/admin_changelog",
    access_control(["admin", "stock", "sales"]),
    async (request, response) => { // Добавили async
        const editID = request.query.edit_id;
        let startDate = "";
        let endDate = "";
        let product_id = request.query.product_id || 1;
        let user_id =  request.query.user_id || request.session.user.staffID;
        console.log('request')
        if (editID) {
            try {
                const [allChangelog, editChangelog, allUsers, features] = await Promise.all([
                    Changelog.getAll(),
                    Changelog.getById(editID),
                    Users.getAll(),
                    Feature.getFeaturesByProductId(editChangelog.productId) 
                ]);

                response.status(200).render("admin_changelog", {
                    allItems: allChangelog,
                    editItem: editChangelog,
                    allUsers,
                    features, 
                    accessRole: request.session.user.accessRole,
                    startDate,
                    endDate,
                    product_id,
                    user_id
                });
            } catch (error) {
                response.status(500).send("An error happened! " + error);
            }
        } else if(Object.keys(request.query).length !== 0) {
            console.log('filter request')
                try {
                    startDate = request.query.start_date;
                    endDate = request.query.end_date
                        ? request.query.end_date
                        : startDate;

                    const [allChangelog, allUsers] = await Promise.all([
                        Changelog.getAllFromProduct(request.query.product_id, startDate, endDate, user_id),
                        Users.getAll()
                    ]);


                    response.status(200).render("admin_changelog", {
                        allItems: allChangelog,
                        allUsers,
                        editItem: {
                            id: 0,
                            date: "",
                            username: "",
                            message: "",
                        },
                        accessRole: request.session.user.accessRole,
                        startDate,
                        endDate,
                        product_id: request.query.product_id,
                        user_id
                    });
                } catch (error) {
                    response.status(500).send("An error happened! " + error);
                }

        }  else if (Object.keys(request.query).length === 0) {
            try {
                const [allChangelog, allUsers] = await Promise.all([
                    Changelog.getAll(),
                    Users.getAll()
                ]);

                response.status(200).render("admin_changelog", {
                    allItems: allChangelog,
                    allUsers,
                    editItem: {
                        id: 0,
                        date: "",
                        username: "",
                        message: "",
                    },
                    accessRole: request.session.user.accessRole,
                    startDate,
                    endDate,
                    product_id,
                    user_id
                });
            } catch (error) {
                response.status(500).send("An error happened! " + error);
            }
        }
    });

adminChangelogController.post("/admin_changelog",
    access_control(["admin", "stock", "sales"]),
    async (request, response) => { // Добавили async

        const formData = request.body;

        const editModel = Changelog.newChangelog(
            formData.id,
            null,
            formData.username,
            formData.message,
        );

        if (formData.action === "create") {
            try {
                const [result] = await Changelog.create(editModel);
                response.redirect("/admin_changelog");
            } catch (error) {
                response.status(500).send("An error happened! " + error);
            }
        } else if (formData.action === "update") {
            try {
                const [result] = await Changelog.update(editModel);
                response.redirect("/admin_changelog");
            } catch (error) {
                response.status(500).send("An error happened! " + error);
            }
        } else if (formData.action === "delete") {
            try {
                const [result] = await Changelog.deleteById(editModel.id);
                response.redirect("/admin_changelog");
            } catch (error) {
                response.status(500).send("An error happened! " + error);
            }
        }
    });

export default adminChangelogController;
