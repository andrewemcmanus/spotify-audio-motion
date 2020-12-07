const express = require("express");
const router = express.Router();
require("dotenv").config();
const db = require("../models");
const querystring = require("querystring");
// const passport = require('../config/ppConfig');
const axios = require("axios");
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authKey = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

// USER HOMEPAGE
router.get('/', (req, res) => {
    res.render('/search', { tracks: [] })
})

// USER FAVORITES
router.get('/', (req, res) => {
    db.favorite.findAll({
        where: {
            userId: req.session.passport.user
        }
    })
    .then((tracks) => {
        // console.log(tracks)
        const spotifyIds = tracks.map(track => {
            return track.spotify_id
        })
        return db.favorites.findAll({
            where: {
                songId: spotifyIds
            }
        })
    })
    .then((tracks) => {
        res.render('/profile', { favorites, tracks: [] })
    })
})

// FIND SONGS
router.get("/:track", (req, res) => {
  axios
    .post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: `Basic ${authKey}`,
        },
      }
    )
    .then((response) => {
      let token = response.data.access_token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let track = encodeURIComponent(req.query.track);
      let limit = 20;
      axios
        .get(
          `https://api.spotify.com/v1/search?q=${track}&type=track,track&offset=0&limit=${limit}`,
          config
        )
        .then((response) => {
          let tracks = response.data.tracks.items;
          // console.log(tracks);
          // console.log(tracks[0].artists[0].name);
          res.render('trackResults', { tracks });
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

// FIND ARTISTS
// router.get("/:artist", (req, res) => {
//   axios
//     .post(
//       "https://accounts.spotify.com/api/token",
//       querystring.stringify({
//         grant_type: "client_credentials",
//       }),
//       {
//         headers: {
//           Authorization: `Basic ${authKey}`,
//         },
//       }
//     )
//     .then((response) => {
//       let token = response.data.access_token;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       let artist = encodeURIComponent(req.query.artists);
//       axios
//         .get(
//           `https://api.spotify.com/v1/search?q=${artist}&type=artist,artist&offset=0&limit=10`,
//           config
//         )
//         .then((response) => {
//           // console.log(track);
//           let artists = response.data.tracks.items;
//           console.log(artists);
//           // for (let i = 0; i < tracks.length; i++) {
//           //   console.log(tracks[i].album.artists[0].name);
//           // }
//           res.render('trackResults', { tracks });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
// });


// ADD TRACK TO FAVORITES
router.post('/', (req, res) => {
  const songId = req.body.songId;
  // const title = req.body.title; these aren't even in the favorites database I made!
  // const artist = req.body.artist;
  const preview = req.body.preview_url; // bounces in the favorites DB
  const userId = req.session.passport.user; // fixed input type and it STILL bounces in the favorites db
  // console.log(userId);
  db.favorite.findOrCreate({
      where: { songId }
      // defaults: {
      //   title,
      //   artist,
      //   preview
      // },
    })
    .then((favorite) => {
      db.favorite.findOrCreate({
        where: {
          songId,
          userId,
          preview
        },
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .then((result) => {
      res.redirect('/');
    });
});

// DELETE TRACK FROM FAVORITES
router.delete('/favorites/:id', async (req, res) => {
  let trackDeleteId = req.params.id;
  let trackToDelete = await db.favorite.destroy({
    where: {
      songId: trackDeleteId,
      userId: req.session.passport.user
    }
  }).catch(err) => {
    console.log(err);
  };
  if (!trackToDelete) {
    res.render("Error. Try again")
  } else {
    res.redirect('/profile')
  }
})

// ADD USER'S OWN GENRE LABEL
router.put('/', (req, res) => {

})

// DELETE YOUR GENRE LABEL
router.delete('/favorites/:')

module.exports = router;
