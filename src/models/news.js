import { db_conn } from "../db/database.js";

export function newNews(
    id,
    date,
    title,
    description
) {
    return {
        id,
        date,
        title,
        description
    }
}

export function getAll() {
    return db_conn.query("SELECT * FROM news")
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                result => newNews(
                    result.news_id,
                    result.news_date,
                    result.news_title,
                    result.news_description
                )
            )
        })
}

export function getById(newsID) {
    return db_conn.query("SELECT * FROM news WHERE news_id = ?", [
        newsID,
    ]).then(([queryResult]) => {
        // check that at least 1 order was found
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]

            // convert result into a model object
            return newNews(
                result.news_id,
                result.news_date,
                result.news_title,
                result.news_description
            )
        } else {
            return Promise.reject("no matching results")
        }

    })
}

export function getBySearch(searchTerm) {
    return db_conn.query(
        "SELECT * FROM news WHERE news_title LIKE ? OR news_description LIKE ?",
        [`%${searchTerm}%`, `%${searchTerm}%`]
    ).then(([queryResult]) => {
        // convert each result into a model object
        return queryResult.map(
            result => newNews(
                result.news_id,
                result.news_date,
                result.news_title,
                result.news_description
            )
        )

    })
}

export function create(news) {
    return db_conn.query(
        `
        INSERT INTO news 
        (news_date, news_title, news_description) 
        VALUES (now(), ?, ?)
    `,
        [news.title, news.description]
    );
}

export function update(news) {
    return db_conn.query(
        `
        UPDATE news
        SET news_title = ?, news_description = ?
        WHERE news_id = ?
    `,
        [news.title, news.description, news.id]
    );
}

export function deleteById(newsID) {
    return db_conn.query("DELETE FROM news WHERE news_id = ?", [
        newsID,
    ]);
}
