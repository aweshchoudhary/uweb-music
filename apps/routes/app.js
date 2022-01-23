const router = require("express").Router();
const spotifyWebApi = require("spotify-web-api-node");
const wnd = require("window");
const window = new wnd();
const { LocalStorage } = require("node-localstorage");
const ls = new LocalStorage("./scratch");

router.get("/", async (req, res) => {
  const code = req.query.code;
  let latestPlaylist = [];
  let trendingPlaylist = [];
  let topPlaylist = [];
  if (code) {
    const newApi = new spotifyWebApi({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.SECRET_KEY,
      redirectUri: "http://localhost",
    });
    await newApi
      .authorizationCodeGrant(code)
      .then((data) => {
        newApi.setAccessToken(data.body.access_token);
        newApi.setRefreshToken(data.body.refresh_token);
        ls.setItem("authCode", data.body.access_token);
      })
      .catch((err) => console.log(err));
    res.redirect("/");
  }
  const api = new spotifyWebApi({
    accessToken: ls.getItem("authCode"),
  });
  await api.getFeaturedPlaylists({ limit: 20, offset: 0 }).then((data) => {
    latestPlaylist.push(data.body);
  });
  await api
    .searchPlaylists("trending", { limit: 20, offset: 0 })
    .then((data) => trendingPlaylist.push(data.body));
  await api
    .searchPlaylists("top", { limit: 20, offset: 0 })
    .then((data) => topPlaylist.push(data.body));

  res.render("./pages/home", {
    code,
    latestPlaylist,
    trendingPlaylist,
    topPlaylist,
  });
});

router.get("/refresh", (req, res) => {
  const newApi = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET_KEY,
    redirectUri: "http://localhost",
  });
  newApi
    .refreshAccessToken()
    .then((data) => {
      newApi.setRefreshToken(data.body.refresh_token);
      console.log("refreshed");
    })
    .catch((err) => console.log(err));
  res.redirect("/");
});

router.get("/playlist/item", (req, res) => {
  res.render("./pages/playlist");
});

router.get("/user/library", (req, res) => {
  res.render("./pages/library");
});

router.get("/search", (req, res) => {
  const authCode = ls.getItem("authCode");
  const api = new spotifyWebApi({
    accessToken: authCode,
  });
  api
    .getPlaylistTracks("2CI3jc1zYemli0onABu7WN", {
      offset: 0,
      limit: 100,
      fields: "items",
    })
    .then((data) => {
      data.body.items.map((e) => {
        console.log(e.track.name);
      });
    });

  res.render("./pages/search");
});

//playlists

router.get("/playlist/:id", async (req, res) => {
  const playlistID = req.params.id;
  const api = new spotifyWebApi({
    accessToken: ls.getItem("authCode"),
  });
  let searchedPlaylist = [];
  await api.getPlaylist(playlistID).then((data) => {
    searchedPlaylist.push(data.body);
  });

  // console.log(searchedPlaylist);
  searchedPlaylist.map((e) => {
    e.tracks.items.map((e) => {
      const ites = e.track.album.images;
      console.log(ites);
    });
  });
  res.render("pages/playlist", { playlist: searchedPlaylist });
});

module.exports = router;
