import { sequelize, User, Role, UserRole, Game, ProPlayer, ProPlayerGame, Ad, Reservation, Review } from "./database-helper.js";
import bcrypt from "bcrypt";

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function seed() {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate([
    {
      email: "admin@gmail.com",
      password: await hashPassword("admin"),
      username: "admin",
    },
    {
      email: "user@gmail.com",
      password: await hashPassword("user"),
      username: "user",
    },
    {
      email: "proplayer@gmail.com",
      password: await hashPassword("proplayer"),
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

  const games = await Game.bulkCreate([
    { name: "League of Legends", abbreviation: "LoL" },
    { name: "Marvel Rivals", abbreviation: "MR" },
  ]);

  const proPlayers = await ProPlayer.bulkCreate([
    { id: users[2].id, bio: "bio" },
  ]);

  await ProPlayerGame.bulkCreate([
    {
      pro_player_id: proPlayers[0].id,
      game_id: games[0].id,
      current_rank: "Platinum",
      years_experience: 5,
    },
  ]);

  const ads = await Ad.bulkCreate([
    {
      game_id: games[0].id,
      pro_player_id: proPlayers[0].id,
      name: "Professional boosting",
      description: "Description",
      max_reservations_per_user: 2,
      service_type: "Boosting",
      total_spots_available: 4,
      max_duration_minutes: 60,
    },
  ]);

  const reservations = await Reservation.bulkCreate([
    {
      user_id: users[1].id,
      ad_id: ads[0].id,
      customer_notes: "notes",
      start_date: new Date("2025-01-10T17:00:00Z"),
      end_date: new Date("2025-01-10T18:00:00Z"),
    },
    {
      user_id: users[1].id,
      ad_id: ads[0].id,
      customer_notes: "notes",
      start_date: new Date("2025-01-10T14:00:00Z"),
      end_date: new Date("2025-01-10T15:00:00Z"),
    },
  ]);

  await Review.bulkCreate([
    {
      reservation_id: reservations[0].id,
      user_id: users[1].id,
      pro_player_id: proPlayers[0].id,
      rating: 4,
      comment: "comment",
    },
  ]);

  return { users, roles, games, proPlayers, ads, reservations };
}

await seed();