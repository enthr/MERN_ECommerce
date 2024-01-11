import bcrypt from "bcrypt";

import authRoles from "../utils/authRoles.js";

const users = [
    {
        name: "Admin User",
        email: "admin@doe.com",
        password: bcrypt.hashSync("12345", 10),
        role: authRoles.ADMIN
    },
    {
        name: "John Doe",
        email: "john@doe.com",
        password: bcrypt.hashSync("12345", 10),
        role: authRoles.USER
    },
    {
        name: "Jane Doe",
        email: "jane@doe.com",
        password: bcrypt.hashSync("12345", 10),
        role: authRoles.USER
    }
];

export default users;