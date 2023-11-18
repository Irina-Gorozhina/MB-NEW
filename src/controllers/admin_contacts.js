import express from "express"
import bcrypt from "bcryptjs";
import * as Contacts from "../models/contacts.js";
import access_control from "../access_control.js";
import * as Changelog from "../models/changelog.js";
import validator from "validator";



const adminContactsController = express.Router();

adminContactsController.get("/admin_contacts",
    access_control(["admin","stock", "sales"]),
    (request, response) => {

        const editID = request.query.edit_id;
                if (editID) {
            Promise.all([
                Contacts.getAll(),
                Contacts.getById(editID),
            ]).then(([allItems,editItem]) => {
                response.status(200).render("admin_contacts", {
                    allItems,
                    editItem,
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        } else {
            Promise.all([
                Contacts.getAll()
            ]).then(([allItems]) => {

                response.status(200).render("admin_contacts", {
                    allItems,
                    editItem: {
                        id: 0,
                        name: '',
                        surname: '',
                        phone: '',
                        question: ''
                    },
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        }
    })

adminContactsController.post("/admin_contacts",
    access_control(["admin","stock", "sales" ]),
    (request, response) => {
        const formData = request.body;

        const editModel = Contacts.newContact(
            formData.id,
            formData.name,
            formData.surname,
            formData.phone,
            formData.description
        )


        const userUpdateChangelogEntry = Changelog.newChangelog(
            null,
            null,
            request.session.user.username,
            "User " + formData.action + "d contacts with id " + editModel.id,
            request.session.user.staffID,
            -1,
        )
        Changelog.create(userUpdateChangelogEntry).catch(error => {
            console.log(error);
            console.log("Failed to add to change log: " + userUpdateChangelogEntry);
        })

        if (formData.action == "create") {
            Contacts.create(editModel).then(([result]) => {
                response.redirect("/admin_contacts");
            });
        } else if (formData.action == "update") {
            Contacts.update(editModel).then(([result]) => {
                response.redirect("/admin_contacts");
            });
        } else if (formData.action == "delete") {
            Contacts.deleteById(editModel.id).then(([result]) => {
                response.redirect("/admin_contacts");
            });
        }
    })

export default adminContactsController;
