import * as path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import session from "express-session";
import homeController from "./controllers/home.js"
import newsController from "./controllers/news.js";
import aboutController from './controllers/about.js';
import contactsController from './controllers/contacts.js';
import productListController from "./controllers/product_list.js";
import productItemController from "./controllers/product_item.js";
import productCheckoutController from "./controllers/product_checkout.js";
import authController from "./controllers/auth.js";
import adminStaffController from './controllers/admin_staff.js';
import adminOrdersController from "./controllers/admin_orders.js";
import adminProductsController from "./controllers/admin_products.js";
import adminNewsController from "./controllers/admin_news.js";
import adminContactsController from "./controllers/admin_contacts.js";
import adminChangelogController from "./controllers/admin_changelog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8083;

app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: "secret phrase",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: false },
}))

// Setup and use the EJS view engine
app.set('views', path.join(__dirname,  "views"));
app.set("view engine", "ejs")
app.use(express.static("src/static"))

// Controllers
app.use(homeController)
app.use(newsController);
app.use(aboutController);
app.use(contactsController);
app.use(productListController);
app.use(productItemController);
app.use(productCheckoutController);
app.use(authController);
app.use(adminStaffController);
app.use(adminOrdersController);
app.use(adminProductsController);
app.use(adminNewsController);
app.use(adminContactsController);
app.use(adminChangelogController);

app.get("/", (request, response) => {
  response.status(301).redirect("/home")
})
app.get("*", (request, response) => {
  response.status(404).render("status.ejs", {
    status: "404 Not Found",
    message: "Insert funny joke about the page being missing here"
  })
})

app.listen(port, () => {
  console.log("Express server started on http://localhost:" + port)
})
