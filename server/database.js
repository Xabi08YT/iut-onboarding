import Prisma from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

/**
 * Check if the username is correct or not
 * @param username username of the user
 * @param password password of this same user
 */
export function login(username, password) {
  client.$connect();
  client.$disconnect();
}

/**
 * Gets all the slides
 * @returns {Promise<*>} Return all slides
 */
export async function getSlides() {
  client.$connect();
  let results = await client.Slides.findAll();
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
  await client.Slides.update({
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
  client.$disconnect();
}

/**
 * Creates a new user with the provided data
 * @param data
 * @returns {Promise<void>}
 */
export async function createUser(data) {
  let user = data;
  user.id = null;
  client.$connect();npm r
  client.$disconnect();
}

/**
 * Update an existing user
 * @param data
 * @returns {Promise<void>}
 */
export async function updateUser(data) {
  client.$connect();
  await client.Slide.update({
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
  client.$disconnect();
}

/**
 * Get all events from the database
 * @returns {Promise<void>} all the events
 */
export async function getEvents() {
  client.$connect();
  client.$disconnect();
}

/**
 * Creates a new event with the furnished data
 * @param data data necessary to create the event
 * @returns null
 */
export async function createEvent(data) {
  client.$connect();
  client.$disconnect();
}

/**
 * Update an existing event with this data.
 * @param data
 * @returns null
 */
export async function updateEvent(data) {
  client.$connect();
  await client.Event.update({
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
  client.$disconnect();
}
