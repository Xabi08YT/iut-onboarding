import {PrismaClient} from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

let cfg = dotenv.config();
const client = new PrismaClient();
const saltRounds = cfg.parsed.SALT_ROUNDS ? cfg.parsed.SALT_ROUNDS : 10;
const salt = bcrypt.genSaltSync(saltRounds);

/**
 * Check if the username is correct or not
 * @param username username of the user
 * @param password password of this same user
 */
export async function login(username, password) {
  client.$connect();
  let user = await client.user.findFirst({where: {username}});
  client.$disconnect();
  if(!user) {
    return {ok: false, user:null};
  }
  return {ok:bcrypt.compare(password,user[0].password),user};
}

/**
 * Gets all the slides
 * @returns {Promise<*>} Return all slides
 */
export async function getSlides() {
  client.$connect();
  let results = await client.slide.findMany();
  client.$disconnect();
  return results;
}

/**
 * Update a slide status and duration
 * @param data
 * @returns {Promise<void>}
 */
export async function updateSlide(data) {
  client.$connect();
  await client.slide.update({
    where: {id: data.id},
    data,
  });
  client.$disconnect();
}

/**
 * Get all the users from the database
 * @returns {Promise<void>} All users
 */
export async function getUsers() {
  client.$connect();
  let results = await client.user.findMany();
  client.$disconnect();
  return results;
}

/**
 * Creates a new user with the provided data
 * @param data
 * @returns {Promise<void>}
 */
export async function createUser(data) {
  data.id = null;
  data.password = await bcrypt.hash(data.password);
  client.$connect();
  client.user.create({data});
  client.$disconnect();
}

/**
 * Update an existing user
 * @param data
 * @returns {Promise<void>}
 */
export async function updateUser(data) {
  data.password = await bcrypt.hash(data.password, salt);
  client.$connect();
  await client.slide.update({
    where: {id: data.id},
    data,
  });
  client.$disconnect();
}

/**
 * Delete a user that has the id passed into parameters
 * @param id ID of the user
 * @returns null
 */
export async function deleteUser(id) {
  client.$connect();
  await client.user.delete({where: {id}});
  client.$disconnect();
}

/**
 * Get all events from the database
 * @returns {Promise<void>} all the events
 */
export async function getEvents() {
  client.$connect();
  let results = await client.event.findMany();
  client.$disconnect();
  return results;
}

/**
 * Creates a new event with the furnished data
 * @param data data necessary to create the event
 * @returns null
 */
export async function createEvent(data) {
  data.id = null;
  client.$connect();
  client.event.create({data});
  client.$disconnect();
}

/**
 * Update an existing event with this data.
 * @param data
 * @returns null
 */
export async function updateEvent(data) {
  client.$connect();
  await client.event.update({
    where: {id: data.id},
    data,
  });
  client.$disconnect();
}

/**
 * Deletes the event that has the same ID as the one passed in this function
 * @param id ID of the event to remove
 * @returns null
 */
export async function deleteEvent(id) {
  client.$connect();
  client.event.delete({where: {id}});
  client.$disconnect();
}
