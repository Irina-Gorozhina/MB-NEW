import { db_conn } from "../db/database.js";
import * as security from "../../security.js";

// Order model (object) constructor
export function newOrder(
    id,
    status,
    datetime,
    customer_first_name,
    customer_last_name,
    customer_phone,
    customer_email,
    customer_country,
    customer_city,
    customer_address,
    customer_state,
    customer_post_code,
    count,
    total_price,
    product_id,
    product_name="",
) {
    const order = {
        id,
        status,
        datetime,
        customer_first_name,
        customer_last_name,
        customer_phone,
        customer_email,
        customer_country,
        customer_city,
        customer_address,
        customer_state,
        customer_post_code,
        count,
        total_price,
        product_id,
        product_name,
    }
    security.makeReadable(order)
    return order
}

export function getAll() {
    return db_conn.query("SELECT o.*, p.product_name FROM orders o LEFT JOIN products p ON o.product_id=p.product_id")
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                result => newOrder(
                    result.order_id,
                    result.order_status,
                    result.order_datetime,
                    result.customer_first_name,
                    result.customer_last_name,
                    result.customer_phone,
                    result.customer_email,
                    result.customer_country,
                    result.customer_city,
                    result.customer_address,
                    result.customer_state,
                    result.customer_post_code,
                    result.count,
                    result.total_price,
                    result.product_id,
                    result.product_name,
                )
            )

        })
}


export function getById(orderID) {
    return db_conn.query("SELECT o.*, p.product_name FROM orders o LEFT JOIN products p ON o.product_id=p.product_id WHERE o.order_id = ?", [orderID])
        .then(([queryResult]) => {
            // check that at least 1 match was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]

                // convert result into a model object
                return newOrder(
                    result.order_id,
                    result.order_status,
                    result.order_datetime,
                    result.customer_first_name,
                    result.customer_last_name,
                    result.customer_phone,
                    result.customer_email,
                    result.customer_country,
                    result.customer_city,
                    result.customer_address,
                    result.customer_state,
                    result.customer_post_code,
                    result.count,
                    result.total_price,
                    result.product_id,
                    result.product_name,

                )
            } else {
                return Promise.reject("no matching results")
            }

        })
}


export function create(order) {
    security.sanitize(order)
    return db_conn.query(
        `
        INSERT INTO orders (product_id, order_status, order_datetime, customer_first_name, customer_last_name, customer_phone, customer_email,  
        customer_country,  customer_city, customer_address, customer_state, customer_post_code, count, total_price) 
        VALUES (?, ?, now(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
            order.product_id,
            order.status,
            order.customer_first_name,
            order.customer_last_name,
            order.customer_phone,
            order.customer_email,
            order.customer_country,
            order.customer_city,
            order.customer_address,
            order.customer_state,
            order.customer_post_code,
            order.count,
            order.total_price
        ]
    );
}

export function deleteById(id) {
    return db_conn.query(`DELETE FROM orders WHERE order_id = ?`, [id]);
}

export function update(item) {
    return db_conn.query(
        `
            UPDATE orders
            SET order_status = ?,  customer_first_name = ?, customer_last_name = ?, customer_phone = ?,
                customer_email = ?, customer_country = ?, customer_city = ?, customer_address = ?, customer_state = ?,
                customer_post_code = ?, count = ?, total_price = ?, product_id = ?
            WHERE order_id = ?
        `,
        [item.status, item.customer_first_name, item.customer_last_name, item.customer_phone,
         item.customer_email, item.customer_country, item.customer_city, item.customer_address, item.customer_state,
         item.customer_post_code, item.count, item.total_price, item.product_id,
         item.id]
    );
}

export function updateStatusById(orderID, status) {
    return db_conn.query(
        `
        UPDATE orders
        SET order_status = ?
        WHERE order_id = ?
    `,
        [status, orderID]
    );
}
