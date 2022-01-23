const spotifyWebApi = require("spotify-web-api-node");

const newApi = new spotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
  redirectUri: "http://localhost:80/",
});
