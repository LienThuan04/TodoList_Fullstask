"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const db_1 = require("config/db");
const tasksRouters_1 = __importDefault(require("routes/tasksRouters"));
const account_Routers_1 = __importDefault(require("routes/account.Routers"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// use a local variable name to avoid redeclaring the Node-provided __dirname
const projectRoot = path_1.default.resolve();
// Middleware to parse JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//middleware cors
if (process.env.NODE_ENV !== "production") {
    app.use((0, cors_1.default)({
        origin: ['http://localhost:5174', 'http://localhost:5173'],
    }));
}
// Serve static files for avatars public/avatars
app.use("/avatars", express_1.default.static(path_1.default.join(process.cwd(), "public", "avatars"))); // serve files from project-root/public/avatars
// Note: avoid leading '/' in path.join segments because that makes the segment absolute
// and ignores the previous parts. Use process.cwd() (project root) or __dirname + '..' when
// resolving a path relative to the source file.
// Importing the routes
(0, tasksRouters_1.default)(app);
(0, account_Routers_1.default)(app);
// config frontend build files
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(projectRoot, "../Frontend/dist")));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(projectRoot, "../Frontend/dist/index.html"));
    });
}
;
// Connect to the database
(0, db_1.connectDB)().then(() => {
    // Starting the server after successful DB connected
    app.listen(PORT, () => {
        console.log(`Server is starting...: ${projectRoot}`);
        const url = `http://localhost:${PORT}`;
        console.log(`Server is running on PORT: \x1b[32m\u001b]8;;${url}\u0007${url}\u001b]8;;\u0007\x1b[0m`);
    });
});
//# sourceMappingURL=server.js.map