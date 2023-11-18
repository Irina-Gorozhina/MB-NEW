import { db_conn } from "../db/database.js";

export function newContact(
    id,
    name,
    surname,
    phone,
    question
) {
    return {
        id,
        name,
        surname,
        phone,
        question
    }
}

export function getAll() {
    return db_conn.query("SELECT * FROM contacts")
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                result => newContact(
                    result.contact_id,
                    result.contact_name,
                    result.contact_surname,
                    result.contact_phone,
                    result.contact_question
                )
            )

        })
}

export function getById(contactID) {
    return db_conn.query("SELECT * FROM contacts WHERE contact_id = ?", [
        contactID,
    ]).then(([queryResult]) => {
        // check that at least 1 order was found
        if (queryResult.length > 0) {
            // get the first matching result
            const result = queryResult[0]

            // convert result into a model object
            return newContact(
                result.contact_id,
                result.contact_name,
                result.contact_surname,
                result.contact_phone,
                result.contact_question
            )
        } else {
            return Promise.reject("no matching results")
        }

    })
}

export function getBySearch(searchTerm) {
    return db_conn.query(
        "SELECT * FROM contacts WHERE contact_name LIKE ? OR contact_surname LIKE ?",
        [`%${searchTerm}%`, `%${searchTerm}%`]
    ).then(([queryResult]) => {
        // convert each result into a model object
        return queryResult.map(
            result => newContact(
                result.contact_id,
                result.contact_name,
                result.contact_surname,
                result.contact_phone,
                result.contact_question
            )
        )

    })
}

export function create(contact) {
    return db_conn.query(
        `
        INSERT INTO contacts 
        (contact_name, contact_surname, contact_phone, contact_question) 
        VALUES (?, ?, ?, ?)
    `,
        [contact.name, contact.surname, contact.phone, contact.question]
    );
}

export function update(contact) {
    return db_conn.query(
        `
        UPDATE contacts
        SET contact_name = ?, contact_surname = ?, contact_phone = ?, contact_question = ?
        WHERE contact_id = ?
    `,
        [contact.name, contact.surname, contact.phone, contact.question, contact.id]
    );
}

export function deleteById(contactId) {
    return db_conn.query("DELETE FROM contacts WHERE contact_id = ?", [
        contactId,
    ]);
}
