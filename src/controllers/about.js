
import express from "express";
const aboutController = express.Router()
aboutController.get("/about", (request, response) => {
    response.status(200).render("about")
})

export default aboutController
