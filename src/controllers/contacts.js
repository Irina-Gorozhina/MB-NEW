import express from "express";
import * as Contacts from "../models/contacts.js"

const contactsController = express.Router()
contactsController.get("/contacts", (request, response) => {
    response.status(200).render("contacts", { status: 'wait' })
})

contactsController.post("/contacts", (request, response) => {
    if (request.body) {
        const formData = request.body
        Contacts.create({
            name: formData.name,
            surname: formData.surname,
            phone: formData.phone,
            question: formData.question
        }).then(products => {
            response.status(200).render("contacts", { status: 'send' })
        }).catch(error => {
            response.status(500).send("An error happened! " + error)
        })
    } else {
        response.status(200).render("contacts", { status: 'wait' })
    }
})

export default contactsController
