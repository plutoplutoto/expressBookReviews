const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    console.log(hahahaha)
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
// app.use(session({ secret: "fingerprint", resave: true, saveUninitialized: true }))
// app.use("/auth/*", function auth(req, res, next) {
//     console.log("Authenticating user...");
//     if (req.session.authorization && req.session.authorization.accessToken) {
//         const token = req.session.authorization.accessToken;

//         // Verify JWT token with secure secret
//         jwt.verify(token, process.env.JWT_SECRET || "default_secret_key", (err, user) => {
//             if (!err) {
//                 req.user = user;
//                 console.log("User authenticated");
//                 next(); // Proceed to the next middleware
//             } else {
//                 console.error("JWT verification failed:", err.message);
//                 res.status(403).json({ message: "User not authenticated" });
//             }
//         });
//     } else {
//         console.warn("No authorization found in session.");
//         res.status(403).json({ message: "User not logged in" });
//     }
// });
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
