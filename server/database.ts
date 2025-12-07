import {PrismaClient} from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import NodeCache from "node-cache";

dotenv.config();

const client = new PrismaClient();
const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
// Setting a cache with a 10 mn TTL for each item
const cache = new NodeCache({stdTTL: 10 * 60});

export interface PrismaKeyValue {
  key: string,
  value: string
}

export interface AuthenticatedUser {
  id: number,
  username: string,
  password: string,
  role: JsonValue;
}

export interface LoginResult {
  ok: boolean;
  user: AuthenticatedUser|null;
}

export interface Slide {
  id: number,
  name: string,
  active: boolean,
  time: number;
}

export interface PanelUser {
  id: number,
  username: string,
  role: JsonValue;
}

export interface RegularEvent {
  id: number,
  title: string,
  startTS: Date,
  endTS: Date,
  description: string,
  image: string|null,
  channel: number; // difference between CultureEvent and this
}

export interface CultureEvent {
  id: number,
  title: string,
  startTS: Date,
  endTS: Date,
  eventTS: Date|null, // difference between Event and this
  description: string,
  image: string|null,
}

export interface AtelierPrisma {
  id: number,
  name: string,
  room: string,
  start: Date,
  end: Date
}

export interface ConferencePrisma {
  id: number,
  room: string,
  who: string,
  when: Date
}

/**
 * Check if the username is correct or not
 * @param username username of the user
 * @param password password of this same user
 */
export async function login(username: string, password: string): Promise<LoginResult> {
  await client.$connect();
  const user = await client.user.findFirst({where: { username },});
  await client.$disconnect();

  if (!user) {
    return { ok: false, user: null };
  }

  const isValid = await Bun.password.verify(password, user.password);
  if (!isValid) {
    return { ok: false, user: null };
  }

  const typedUser: AuthenticatedUser = {
    id: user.id,
    username: user.username,
    password: user.password,
    role: user.role,
  };

  return {
    ok: true,
    user: typedUser,
  };
}


/**
 * Gets all the slides
 * @returns {Promise<*>} Return all slides
 */
export async function getSlides(): Promise<Slide[]> {
  const cachedData = cache.get("slides");

  if (!cachedData) {
    client.$connect();
    let results = await client.slide.findMany({orderBy: {name: "asc"}});
    client.$disconnect();
    cache.set("slides", results);
    return results;
  }
  return cachedData as Slide[];
}

/**
 * Update a slide status and duration
 * @param data
 * @returns {Promise<void>}
 */
export async function updateSlide(data: any): Promise<void> {
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
export async function getUsers(): Promise<PanelUser[]> {
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
  return results as PanelUser[];
}

/**
 * Creates a new user with the provided data
 * @param data
 * @returns {Promise<void>}
 */
export async function createUser(data: any): Promise<void> {
  data.password = await Bun.password.hash(data.password, {algorithm: "bcrypt", cost: 4})
  client.$connect();
  await client.user.create({data});
  client.$disconnect();
}

/**
 * Update an existing user
 * @param data
 * @returns {Promise<void>}
 */
export async function updateUser(data: any): Promise<void> {
  data.password = await Bun.password.hash(data.password, {algorithm: "bcrypt", cost: 4})
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
export async function deleteUser(id: number): Promise<void> {
  client.$connect();
  await client.user.delete({where: {id}});
  client.$disconnect();
}

/**
 * Get all events from the database
 * @returns {Promise<void>} all the events
 */
export async function getEvents(): Promise<RegularEvent[]> {
  client.$connect();
  let results = await client.event.findMany({orderBy: {startTS: "asc"}});
  client.$disconnect();

    return results;
}

export async function getOngoingEvents(): Promise<RegularEvent[]> {
  const cachedData = cache.get<RegularEvent[]>("events");

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
  return cachedData as RegularEvent[];
}

/**
 * Creates a new event with the furnished data
 * @param data data necessary to create the event
 * @returns null
 */
export async function createEvent(data: any): Promise<void> {
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
export async function updateEvent(data: any): Promise<void> {
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
export async function deleteEvent(id: string): Promise<void> {
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
export async function createCultureEvent(data: any) {
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
export async function updateCultureEvent(data: any) {
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
      image: data.image
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
export async function deleteCultureEvent(id: string) {
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
 * @returns {Promise<CultureEvent[]>}
 */
export async function getCultureOngoingEvents(): Promise<CultureEvent[]> {
  const cachedData = cache.get<CultureEvent[]>("cevents");

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
  return cachedData as CultureEvent[];
}

/**
 * Get all culture events from the database
 * @returns {Promise<void>} all the culture events
 */
export async function getCultureEvents(): Promise<CultureEvent[]> {
  client.$connect();
  let results = await client.cultureEvent.findMany({orderBy: {startTS: "asc"}});
  client.$disconnect();

    return results;
}

/**
 * Get the value of the key from the database
 * @param key
 * @returns {Promise<void>} the config values
 */
export async function getConfigValue(key: string): Promise<PrismaKeyValue|null> {
  client.$connect();
  let results = await client.config.findFirst({where: {key}});
  client.$disconnect();
  return results;
}

/**
 * Update a configuration value.
 * @param data
 * @returns null
 */
export async function updateConfigValue(data: any): Promise<void> {
  client.$connect();
  await client.config.update({
    where: {
      key: data.key,
    },
    data: data
  })
  client.$disconnect();

    //Update cache
    client.$connect();
    let result = client.config.findMany({
        orderBy: {key: "asc"}
    });
    client.$disconnect();
    cache.set("discord", result)
}

/**
 * Get the conference from the database
 * @returns {Promise<void>} all the conference
 */
export async function getConference() {
    client.$connect();
    let results = await client.conference.findMany({
        where: {
            when: {
                gte: new Date((new Date()).getTime() - 1000 * 60 * 30)
            }
        },
        orderBy: {when: "asc"}
    });
    client.$disconnect();
    return results;
}

/**
 * Update a conference
 * @param data
 * @returns null
 */
export async function updateConference(data: ConferencePrisma) {
  data.when = new Date(data.when);
  client.$connect();
  await client.conference.update({
    where: {
      id: data.id,
    },
    data: data
  })
  client.$disconnect();

    //Update cache
    client.$connect();
    let result = client.conference.findMany({
        orderBy: {when: "asc"}
    });
    client.$disconnect();
    cache.set("conference", result)
}

/**
 * Delete a conference
 * @param id
 * @returns null
 */
export async function deleteConference(id: string) {
  client.$connect();
  await client.conference.delete({
    where: {id: parseInt(id),}
  })
  client.$disconnect();

    //Update cache
    client.$connect();
    let result = client.conference.findMany({
        orderBy: {when: "asc"}
    });
    client.$disconnect();
    cache.set("conference", result)
}

/**
 * Create a conference
 * @param data
 * @returns null
 */
export async function createConference(data: ConferencePrisma) {
  data.when = new Date(data.when);
  client.$connect();
  await client.conference.create({data})
  client.$disconnect();
}

/**
 * Get the ateliers from the database
 * @returns {Promise<void>} all the ateliers
 */
export async function getAtelier(): Promise<AtelierPrisma[]> {
  client.$connect();
  let results = await client.atelier.findMany({
    where: {
        end: {
          gte: new Date((new Date()).getTime()-1000*60*30)
        }
      },
    orderBy: {start: "asc"}
  });
  client.$disconnect();
  return results;
}

/**
 * Update a atelier
 * @param data
 * @returns null
 */
export async function updateAtelier(data: AtelierPrisma) {
  data.start = new Date(data.start);
  data.end = new Date(data.end);
  client.$connect();
  await client.atelier.update({
    where: {
      id: data.id,
    },
    data: data
  })
  client.$disconnect();

    //Update cache
    client.$connect();
    let result = client.atelier.findMany({
        orderBy: {name: "asc"}
    });
    client.$disconnect();
    cache.set("atelier", result)
}

/**
 * Delete a conference
 * @param id
 * @returns null
 */
export async function deleteAtelier(id: string) {
  client.$connect();
  await client.atelier.delete({
    where: {id: parseInt(id),}
  })
  client.$disconnect();

    //Update cache
    client.$connect();
    let result = client.atelier.findMany({
        orderBy: {name: "asc"}
    });
    client.$disconnect();
    cache.set("atelier", result)
}

/**
 * Create a atelier
 * @param data
 * @returns null
 */
export async function createAtelier(data: AtelierPrisma) {
  client.$connect();
  data.start = new Date(data.start);
  data.end = new Date(data.end);
  await client.atelier.create({data})
  client.$disconnect();
}