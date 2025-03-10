// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "nuxt-lucide-icons",
  ],

  lucide: {
    namePrefix: "Lucide"
  },

  css: ["./stylesheets/global.css"],

  app: {
    baseURL: "/info/"
  },

  googleFonts: {
    display: "swap",
    outputDir: "assets/fonts/",
    families: {
      Fredoka: {
        wght: ["75..125",500]
      },
      Poppins: {
        wght: 300
      }
    }
  },

  routeRules: {
    "api/hp/**": {
      proxy: "https://hyperplanning.iut.u-bordeaux.fr/Telechargements/ical/**"
    },
    // Add cors headers
    "/api/v1/**": { cors: true },
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui"
  }
};
