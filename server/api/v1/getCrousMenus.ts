/* eslint-disable object-shorthand */
import * as cheerio from "cheerio";
import fetch from "node-fetch";

const CROUS_RESTAURANT_BASE_URL = "https://www.crous-bordeaux.fr/restaurant/";
const SIRTAKI_URL = `${CROUS_RESTAURANT_BASE_URL}crous-cafet-le-sirtaki`;
const SPACE_URL = `${CROUS_RESTAURANT_BASE_URL}space-campus-resto-u-3`;

interface CrousMenu {
  sirtakiEnabled: boolean;
  spaceEnabled: boolean;
  sirtaki: string[] | null;
  space: string[] | null;
}

/**
 * Sélectionne tous les plats du menu du jour actuel, sans les entrées ni les desserts
 * @param {string} URL
 *  L'URL du site (space ou sirtaki)
 * @return {string[]} un tableau de string correspondant aux plats du site pour le jour actuel
 */
async function fetchMenu(URL: string): Promise<string[] | null> {
  const response = await fetch(URL, { method: 'GET' })

  if (!response.ok) return null

  const html = await response.text()
  if (!html) return null

  let $ = cheerio.load(html)
  const tabPlats: string[] = []

  let htmlSelfMenu = $('ul.meal_foodies > li:nth-child(3)')
  if (URL === SPACE_URL) {
    htmlSelfMenu = $('ul.meal_foodies > li:nth-child(2)')
  }

  const innerHtml = htmlSelfMenu.html()
  if (!innerHtml) return null

  $ = cheerio.load(innerHtml)

  $('li').each((_, htmlPlat) => {
    let plat = $(htmlPlat).html() ?? ''

    if (
      plat.includes(':') ||
      plat.includes('(') ||
      plat.length === 0
    ) return

    if (
      plat.toLowerCase().includes('entrées') ||
      plat.toLowerCase().includes('desserts') ||
      plat.toLowerCase().includes('salade')
    ) return

    plat = plat.replaceAll('*', '')
    plat = plat.replaceAll('<br>', '')
    plat = plat.replaceAll('</br>', '')
    plat = plat.replaceAll('<br/>', '')

    if (URL === SIRTAKI_URL) {
      plat = plat.replaceAll('-', '')
    }

    if (plat.includes('Plat')) {
      plat = plat.toUpperCase()
    }

    const tmp = plat.replaceAll(' ', '')

    if (tmp.length > 0 && !plat.toLowerCase().includes('menu non communiqué')) {
      tabPlats.push(plat.charAt(0).toUpperCase() + plat.slice(1))
    }
  })

  return tabPlats
}

/**
 * Sélectionne les plats du jour actuel pour les deux restaurants crous
 * @return Un objet contennant les plats des restaurants crous
 */
export async function getAllRestaurantsMenus(): Promise<CrousMenu> {
  let sirtaki: string[] | null = null
  let space: string[] | null = null
  let sirtakiEnabled = true
  let spaceEnabled = true

  try {
    sirtaki = await fetchMenu(SIRTAKI_URL)
  } catch (error) {
    console.error(`Unable to retrieve Menu for Sirtaki. Error: ${error}`)
    sirtakiEnabled = false
  }

  if (!sirtaki || sirtaki.length === 0) {
    sirtakiEnabled = false
  }

  try {
    space = await fetchMenu(SPACE_URL)
  } catch (error) {
    console.error(`Unable to retrieve Menu for Space. Error: ${error}`)
    spaceEnabled = false
  }

  if (!space || space.length === 0) {
    spaceEnabled = false
  }

  return {
    sirtakiEnabled,
    spaceEnabled,
    sirtaki,
    space
  }
}


export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    try {
      const menus = await getAllRestaurantsMenus();
      return { statusCode: 200, body: JSON.stringify(menus) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify(error) };
    }
  }
});
