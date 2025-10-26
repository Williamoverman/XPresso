import { sequelize, User, Role, UserRole, ProPlayer } from "./database-helper.js";
import bcrypt from "bcrypt";
import readline from "readline";

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function seed() {
    await sequelize.sync();

    // controleer of de database al geseed is
    const userCount = await User.count();
    if (userCount > 0) {
        console.log("Database is al geseed seeding wordt overgeslagen.");
        return;
    }

    // maak een readline interface voor gebruikersinput
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
            rl.question("Wil je de database seeden met gebruikers voor de live omgeving? (y/n): ", (answer) => {
            rl.close();
            resolve(answer.toLowerCase());
        });
    });

    if (answer !== "y") {
        console.log("Seeding overgeslagen.");
        return;
    }

    const users = await User.bulkCreate([
        {
            email: "admin@gmail.com",
            password: await hashPassword("adminadmin"),
            username: "admin",
        },
        {
            email: "user@gmail.com",
            password: await hashPassword("useruser"),
            username: "user",
        },
        {
            email: "proplayer@gmail.com",
            password: await hashPassword("proplayerproplayer"),
            username: "proplayer",
        },
    ]);

    const roles = await Role.bulkCreate([
        { name: "User" },
        { name: "Admin" },
        { name: "ProPlayer" },
    ]);

    await UserRole.bulkCreate([
        { user_id: users[0].id, role_id: roles[1].id },
        { user_id: users[1].id, role_id: roles[0].id },
        { user_id: users[2].id, role_id: roles[2].id },
    ]);

    const proPlayers = await ProPlayer.bulkCreate([
        { id: users[2].id, bio: "Beste speler ter wereld" },
    ]);

    return { users, roles };
}

export { seed };