import {PrismaClient} from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import NodeCache from "node-cache";

const cfg = dotenv.config();
const client = new PrismaClient();
const saltRounds = cfg.parsed.SALT_ROUNDS ? parseInt(cfg.parsed.SALT_ROUNDS) : 10;
const salt = bcrypt.genSaltSync(saltRounds);
// Setting a cache with a 10 mn TTL for each item
const cache = new NodeCache({stdTTL: 10 * 60});


/**
 * Check if the username is correct or not
 * @param username username of the user
 * @param password password of this same user
 */
export async function login(username, password) {
  client.$connect();
  let user = await client.user.findFirst({where: {username}});
  client.$disconnect();
  if (!user) {
    return {ok: false, user: null};
  }
  return {ok: bcrypt.compare(password, user.password), user};
}

/**
 * Gets all the slides
 * @returns {Promise<*>} Return all slides
 */
export async function getSlides() {
  const cachedData = cache.get("slides");

  if (!cachedData) {
    client.$connect();
    let results = await client.slide.findMany({orderBy: {name: "asc"}});
    client.$disconnect();
    cache.set("slides", results);
    return results;
  }
  return cachedData;
}

/**
 * Update a slide status and duration
 * @param data
 * @returns {Promise<void>}
 */
export async function updateSlide(data) {
  data.time = parseInt(data.time);
  client.$connect();
  await client.slide.update({
    where: {id: data.id},
    data,
  });
  client.$disconnect();

  //Updating the cache
  client.$connect();
  let results = await client.slide.findMany({orderBy: {name: "asc"}});
  client.$disconnect();
  cache.set("slides", results);
}

/**
 * Get all the users from the database
 * @returns {Promise<void>} All users
 */
export async function getUsers() {
  client.$connect();
  let results = await client.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
    },
    orderBy: {
      username: "asc",
    }
  });
  client.$disconnect();
  return results;
}

/**
 * Creates a new user with the provided data
 * @param data
 * @returns {Promise<void>}
 */
export async function createUser(data) {
  data.password = await bcrypt.hash(data.password, salt);
  client.$connect();
  await client.user.create({data});
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
  await client.user.update({
    where: {id: parseInt(data.id)},
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
  let results = await client.event.findMany({orderBy: {startTS: "asc"}});
  client.$disconnect();

  return results;
}

export async function getOngoingEvents() {
  const cachedData = cache.get("events");

  if (!cachedData || cachedData.length === 0) {
    client.$connect();
    let results = await client.event.findMany({
      where: {
        startTS: {
          lte: new Date()
        }, endTS: {
          gte: new Date()
        }
      }, orderBy: {channel: "asc"}
    });
    client.$disconnect();
    cache.set("events", results);
    return results;
  }
  return cachedData;
}

/**
 * Creates a new event with the furnished data
 * @param data data necessary to create the event
 * @returns null
 */
export async function createEvent(data) {
  data.startTS = new Date(data.startTS);
  data.endTS = new Date(data.endTS);
  client.$connect();
  await client.event.create({data});
  client.$disconnect();

  //Update cache
  client.$connect();
  let results = await client.event.findMany({
    where: {
      startTS: {
        lte: new Date()
      }, endTS: {
        gte: new Date()
      }
    }, orderBy: {channel: "asc"}
  });
  client.$disconnect();
  cache.set("events", results);
}

/**
 * Update an existing event with this data.
 * @param data
 * @returns null
 */
export async function updateEvent(data) {
  client.$connect();
  await client.event.update({
    where: {
      id: parseInt(data.id),
    },
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
      startTS: new Date(data.startts),
      endTS: new Date(data.endts),
      image: data.image,
      channel: data.channel
    },
  });
  client.$disconnect();

  //Update cache
  client.$connect();
  let results = await client.event.findMany({
    where: {
      startTS: {
        lte: new Date()
      }, endTS: {
        gte: new Date()
      }
    }, orderBy: {channel: "asc"}
  });
  client.$disconnect();
  cache.set("events", results);
}

/**
 * Deletes the event that has the same ID as the one passed in this function
 * @param id ID of the event to remove
 * @returns null
 */
export async function deleteEvent(id) {
  client.$connect();
  await client.event.delete({where: {id: parseInt(id)}});
  client.$disconnect();
  //Update cache
  client.$connect();
  let results = await client.event.findMany({
    where: {
      startTS: {
        lte: new Date()
      }, endTS: {
        gte: new Date()
      }
    }, orderBy: {channel: "asc"}
  });
  client.$disconnect();
  cache.set("events", results);
}

/**
 * Create a culture event in the database
 * @param data
 * @returns {Promise<void>}
 */
export async function createCultureEvent(data) {
  data.startTS = new Date(data.startTS);
  data.endTS = new Date(data.endTS);
  if(data.eventTS) {
    data.eventTS = new Date(data.eventTS);
  }
  client.$connect();
  await client.cultureEvent.create({data});
  client.$disconnect();

  //Update cache
  client.$connect();
  let results = await client.cultureEvent.findMany({
    where: {
      startTS: {
        lte: new Date()
      }, endTS: {
        gte: new Date()
      }
    }, orderBy: {eventTS: "asc"}
  });
  client.$disconnect();
  cache.set("cevents", results);
}

/**
 * Update an existing culture event with this data.
 * @param data
 * @returns null
 */
export async function updateCultureEvent(data) {
  client.$connect();
  await client.cultureEvent.update({
    where: {
      id: parseInt(data.id),
    },
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
      startTS: new Date(data.startts),
      endTS: new Date(data.endts),
      eventTS: data.eventTS ? new Date(data.eventTS) : undefined,
      image: data.image,
      channel: data.channel
    },
  });
  client.$disconnect();

  //Update cache
  client.$connect();
  let results = await client.cultureEvent.findMany({
    where: {
      startTS: {
        lte: new Date()
      }, endTS: {
        gte: new Date()
      }
    }, orderBy: {eventTS: "asc"}
  });
  client.$disconnect();
  cache.set("cevents", results);
}

/**
 * Deletes the culture event that has the same ID as the one passed in this function
 * @param id ID of the event to remove
 * @returns null
 */
export async function deleteCultureEvent(id) {
  client.$connect();
  await client.cultureEvent.delete({where: {id: parseInt(id)}});
  client.$disconnect();
  //Update cache
  client.$connect();
  let results = await client.cultureEvent.findMany({
    where: {
      startTS: {
        lte: new Date()
      }, endTS: {
        gte: new Date()
      }
    }, orderBy: {eventTS: "asc"}
  });
  client.$disconnect();
  cache.set("cevents", results);
}

/**
 * Get all ongoing Culture Events
 * @returns {Promise<unknown>}
 */
export async function getCultureOngoingEvents() {
  const cachedData = cache.get("cevents");

  if (!cachedData || cachedData.length === 0) {
    client.$connect();
    let results = await client.cultureEvent.findMany({
      where: {
        startTS: {
          lte: new Date()
        }, endTS: {
          gte: new Date()
        }
      }, orderBy: {eventTS: "asc"}
    });
    client.$disconnect();
    cache.set("cevents", results);
    return results;
  }
  return cachedData;
}

/**
 * Get all culture events from the database
 * @returns {Promise<void>} all the culture events
 */
export async function getCultureEvents() {
  client.$connect();
  let results = await client.cultureEvent.findMany({orderBy: {startTS: "asc"}});
  client.$disconnect();

  return results;
}
