import express from "express"
import bcrypt from "bcryptjs";
import * as News from "../models/news.js";
import access_control from "../access_control.js";
import * as Changelog from "../models/changelog.js";

const adminNewsController = express.Router();

adminNewsController.get("/admin_news",
    access_control(["admin","stock", "sales" ]),
    (request, response) => {
        const editID = request.query.edit_id;
        if (editID) {
            Promise.all([
                News.getAll(),
                News.getById(editID),
            ]).then(([allItems,editItem]) => {

                response.status(200).render("admin_news", {
                    allItems,
                    editItem,
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        } else {
            Promise.all([
                News.getAll()
            ]).then(([allItems]) => {

                response.status(200).render("admin_news", {
                    allItems,
                    editItem: {
                        id: 0,
                        date: '',
                        title: '',
                        description: ''
                    },
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        }
    })

adminNewsController.post("/admin_news",
    access_control(["admin","stock", "sales" ]),
    (request, response) => {
        const formData = request.body;

        const editModel = News.newNews(
            formData.id,
            formData.date,
            formData.title,
            formData.description
        )

        const userUpdateChangelogEntry = Changelog.newChangelog(
            null,
            null,
            request.session.user.username,
            "User " + formData.action + "d news with id " + editModel.id,
            request.session.user.staffID,
            -1,
        )
        Changelog.create(userUpdateChangelogEntry).catch(error => {
            console.log(error);
            console.log("Failed to add to change log: " + userUpdateChangelogEntry);
        })

        if (formData.action == "create") {
            News.create(editModel).then(([result]) => {
                response.redirect("/admin_news");
            });
        } else if (formData.action == "update") {
            News.update(editModel).then(([result]) => {
                response.redirect("/admin_news");
            });
        } else if (formData.action == "delete") {
            News.deleteById(editModel.id).then(([result]) => {
                response.redirect("/admin_news");
            });
        }
    })

export default adminNewsController;
