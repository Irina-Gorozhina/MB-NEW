import bcrypt from "bcryptjs";
import express from "express"
import * as Staff from "../models/staff.js"
import * as Changelog from "../models/changelog.js"
import validator from "validator";

const authController = express.Router();

authController.get("/auth_login", (request, response) => {
    response.render("auth_login")
})

authController.post('/auth_login', (request, response) => {
    const login_username = request.body.username;
    const login_password = request.body.password;

    Staff.getByUsername(login_username).then(staff => {
        if (bcrypt.compareSync(login_password, staff.password)) {
            request.session.user = {
                staffID: staff.id,
                accessRole: staff.access_role,
                username: staff.username
            }

            const userLoginChangelogEntry = Changelog.newChangelog(
                null,
                null,
                staff.username,
                "User logged in",
                staff.id,
                -1,
            )

            Changelog.create(userLoginChangelogEntry).catch(error => {
                console.log(error);
                console.log("Failed to add to change log: " + userLoginChangelogEntry)
            })

            // Redirect to staff page
            response.redirect("/admin_products")
        } else {
            response.render("status", {
                status: "Login Failed",
                message: "The password was invalid"
            })
        }
    }).catch(error => {
        console.log(error);
        response.render("status", {
            status: "Login Failed",
            message: "The user was not found"
        })
    })
})

authController.get("/auth_logout", (request, response) => {
    request.session.destroy()
    response.redirect("/auth_login")
})

export default authController
