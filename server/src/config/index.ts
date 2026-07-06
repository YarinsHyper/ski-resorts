export const config = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 9000,
    environment: process.env.NODE_ENV || "development",
  },

  providers: {
    external: {
      baseUrl:
        "https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator",
      timeout: 10000, // 10 seconds
      retries: 1,
    },
  },

  search: {
    maxGroupSize: 10,
    minGroupSize: 1,
    defaultSortBy: "price", // 'price' | 'rating' | 'availability'
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    debug: process.env.DEBUG === "true",
  },

  cache: {
    enabled: process.env.CACHE_ENABLED === "true",
    ttl: 3600, // 1 hour
  },
};

export default config;
