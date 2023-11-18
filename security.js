import validator from "validator";

// UNescape all fields that are string, after getting from in DB
export function makeReadable(obj) {
	Object.keys(obj).forEach((key) => {
		if (typeof obj[key] == "string" && !obj[key].startsWith("$2a")) {
			obj[key] = validator.unescape(obj[key]);
		}
	});
}

// escape all fields that are string, before putting in DB
export function sanitize(obj) {

	Object.keys(obj).forEach((key) => {
		if (typeof obj[key] == "string" && !obj[key].startsWith("$2a")) {
			// don't escape a password!!!
			obj[key] = validator.escape(obj[key]);
		}
	});
	// console.log("AFTER  escape: " + obj.order_id + "\n");
}
