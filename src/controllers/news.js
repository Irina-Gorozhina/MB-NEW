import express from "express"
import * as News from "../models/news.js"
const newsController = express.Router()

newsController.get("/news", (request, response) => {
    News.getAll().then(news => {
        response.status(200).render("news", { news: news })
    }).catch(error => {
        response.status(500).send("An error happened! " + error)
    })
})

export default newsController
