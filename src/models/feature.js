import { db_conn } from "../db/database.js";
import * as security from "../../security.js";


export function newFeature(
    feature_id,
    product_id,
    weight,
    storage,
    battery,
    rear_camera,
    front_camera
) {
    const obj = {
        feature_id,
        product_id,
        weight,
        storage,
        battery,
        rear_camera,
        front_camera
    };
    security.makeReadable(obj);
    return obj;
}


export function getAllFeatures() {
    return db_conn.query("SELECT * FROM feature").then(([queryResult]) => {
        // convert each result into a model object
        return queryResult.map(
            result => newFeature(
                result.feature_id,
                result.product_id,
                result.weight,
                result.storage,
                result.battery,
                result.rear_camera,
                result.front_camera
            )
        );
    });
}


export function getFeaturesByProductId(productId) {
    return db_conn.query("SELECT * FROM feature WHERE product_id = ?", [productId])
        .then(([queryResult]) => {
            // convert each result into a model object
            return queryResult.map(
                result => newFeature(
                    result.feature_id,
                    result.product_id,
                    result.weight,
                    result.storage,
                    result.battery,
                    result.rear_camera,
                    result.front_camera
                )
            );
        });
}
