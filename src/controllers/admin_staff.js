import express from "express"
import bcrypt from "bcryptjs";
import * as Staff from "../models/staff.js";
import access_control from "../access_control.js";
import * as Changelog from "../models/changelog.js";
import validator from "validator";

const adminStaffController = express.Router();

adminStaffController.get("/admin_staff",
    //access_control(["admin", "stock", "sales"]),
    access_control(["admin"]),
    (request, response) => {
        const editID = request.query.edit_id;
        if (editID) {
            Promise.all([
                Staff.getById(editID),
                Staff.getAll()
            ]).then(([editStaff, allStaff]) => {
                response.status(200).render("admin_staff", {
                    allStaff,
                    editStaff,
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        } else {
            Staff.getAll().then(staff => {
                response.status(200).render("admin_staff", {
                    allStaff: staff,
                    editStaff: {
                        id: 0,
                        first_name: '',
                        last_name: '',
                        access_role: 'sales',
                        username: '',
                        password: '',
                    },
                    accessRole: request.session.user.accessRole,
                })
            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            });
        }
})

adminStaffController.post("/admin_staff",
    access_control(["admin"]),
    (request, response) => {
        const formData = request.body;

        const editStaff = Staff.newStaff(
            formData.id,
            formData.first_name,
            formData.last_name,
            formData.access_role,
            formData.username,
            formData.password
        )

        if (!editStaff.password.startsWith("$2a")) {
            editStaff.password = bcrypt.hashSync(editStaff.password);
        }

        const userUpdateChangelogEntry = Changelog.newChangelog(
            null,
            null,
            request.session.user.username,
            "User " + formData.action + "d another user with id " + editStaff.id,
            request.session.user.staffID,
            -1,
        )
        Changelog.create(userUpdateChangelogEntry).catch(error => {
            console.log(error);
            console.log("Failed to add to change log: " + userUpdateChangelogEntry);
        })

        if (formData.action == "create") {
            Staff.create(editStaff).then(([result]) => {
                response.redirect("/admin_staff");
            });
        } else if (formData.action == "update") {
            Staff.update(editStaff).then(([result]) => {
                response.redirect("/admin_staff");
            });
        } else if (formData.action == "delete") {
            Staff.deleteById(editStaff.id).then(([result]) => {
                response.redirect("/admin_staff");
            });
        }
    })

export default adminStaffController;
