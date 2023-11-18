import { db_conn } from "../db/database.js";
import * as Feature from "./feature.js";

export function newProduct(
    id,
    name,
    stock,
    price,
    description,
    brand,
    type,
    staff_id_updated_by,
    features = null 
) {
    return {
        id,
        name,
        stock,
        price,
        description,
        brand,
        type,
        staff_id_updated_by,
        features // add 
    };
}

export function getAll() {
    return db_conn.query("SELECT * FROM products").then(([queryResult]) => {
        // Converting each result into a model object
        return queryResult.map(
            result => newProduct(
                result.product_id,
                result.product_name,
                result.product_stock,
                result.product_price,
                result.product_description,
                result.product_brand,
                result.product_type,
                result.last_updated_by_staff_id,
                null 
            )
        );
    });
}

export function getById(productId) {
    return db_conn.query(
        "SELECT * FROM products WHERE product_id = ?",
        [productId]
    ).then(([queryResult]) => {
        if (queryResult.length > 0) {
            const product = queryResult[0];

            
            return Feature.getFeaturesByProductId(productId).then(features => {
                
                return newProduct(
                    product.product_id,
                    product.product_name,
                    product.product_stock,
                    product.product_price,
                    product.product_description,
                    product.product_brand,
                    product.product_type,
                    product.last_updated_by_staff_id,
                    features
                );
            });
        } else {
            return Promise.reject("Product not found");
        }
    });
}
export function getBySearch(searchTerm) {
    return db_conn.query(
        "SELECT * FROM products WHERE product_name LIKE ? OR product_description LIKE ?",
        [`%${searchTerm}%`, `%${searchTerm}%`]
    ).then(([queryResult]) => {
        // convert each result into a model object
        return queryResult.map(
            result => newProduct(
                result.product_id,
                result.product_name,
                result.product_stock,
                result.product_price,
                result.product_description,
                result.product_brand,
                result.product_type,
                result.last_updated_by_staff_id,
            )
        )

    })
}

export function filter(filter) {
    return db_conn.query(
        "SELECT * FROM products WHERE product_price <= ? AND product_price >= ? AND product_brand IN (?) AND product_type IN (?) AND product_name LIKE ?",
        [filter.max_price, filter.min_price, filter.brand, filter.type, `%${filter.search}%`]
    ).then(([queryResult]) => {
        // convert each result into a model object
        return queryResult.map(
            result => newProduct(
                result.product_id,
                result.product_name,
                result.product_stock,
                result.product_price,
                result.product_description,
                result.product_brand,
                result.product_type,
                result.last_updated_by_staff_id,
            )
        )

    })
}
export function create(product) {
    return db_conn.query(`
        INSERT INTO products
        (product_name, product_stock, product_price, product_description, product_brand, product_type, last_updated_by_staff_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
        product.name,
        product.stock,
        product.price,
        product.description,
        product.brand,
        product.type,
        product.staff_id_updated_by
    ]).then(([result]) => {
        // Вернуть ID нового продукта
        return { id: result.insertId };
    });
}

export function update(product) {
    return db_conn.query(`
        UPDATE products
        SET product_name = ?, product_stock = ?, product_price = ?,
            product_description = ?, product_brand = ?, product_type = ?,
            last_updated_by_staff_id = ?
        WHERE product_id = ?
    `, [
        product.name,
        product.stock,
        product.price,
        product.description,
        product.brand,
        product.type,
        product.staff_id_updated_by,
        product.id
    ]);
}

export function deleteById(id) {
    return db_conn.query("DELETE FROM products WHERE product_id = ?", [id]);
}