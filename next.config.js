module.exports = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    SHORTENER_BASE_URL: process.env.SHORTENER_BASE_URL,
  },
};