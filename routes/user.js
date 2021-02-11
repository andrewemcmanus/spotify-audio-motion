const express = require("express");
const router = express.Router();
require("dotenv").config();
const db = require("../models");
const querystring = require("querystring");
const passport = require('../config/ppConfig');
const axios = require("axios");
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authKey = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

// USER HOMEPAGE
router.get('/', (req, res) => {
    res.render('search', { tracks: [] })
})

// USER FAVES
router.get('/faves', (req, res) => {
    db.fave.findAll({
        where: {
            userId: req.session.passport.user
        }
    })
    .then((response) => {
        let faves = response.data.items;
        const spotifyIds = faves.map(faves => {
            return faves.spotify_id
        })
        return db.faves.findAll({
            where: {
                songId: spotifyIds
            }
        })
    })
    .then((faves) => {
        res.render('profile', { faves })
    })
})

// FIND SONGS
router.get("/:track", (req, res) => {
  // console.log(req.session.passport.user);
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
      // console.log(token);
      let track = encodeURIComponent(req.query.track);
      let resultLimit = 20;
      axios
        .get(
          `https://api.spotify.com/v1/search?q=${track}&type=track,track&offset=0&limit=${resultLimit}`,
          config
        )
        .then((response) => {
          let alltracks = response.data.tracks.items;
          // console.log(alltracks);
          let index = Math.floor((Math.random() * 20));
          console.log(index);
          let tracks = [alltracks[index]];
          // console.log(tracks[0].artists[0].name);
          res.render('trackResults', { tracks });
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

// router.get("/:artist", (req, res) => {
//   // console.log(req.session.passport.user);
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
//       console.log(token);
//       let artist = encodeURIComponent(req.query.artist);
//       let resultLimit = 20;
//       axios
//         .get(
//           `https://api.spotify.com/v1/search?q=${track}&type=track,track&offset=0&limit=${resultLimit}`,
//           config
//         )
//         .then((response) => {
//           let tracks = response.data.tracks.items;
//           // console.log(tracks);
//           // console.log(tracks[0].artists[0].name);
//           res.render('trackResults', { tracks });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
// });

// ADD TRACK TO FAVES
// This is spitting out TWO new instances...one with the userId and one without
router.post('/', (req, res) => {
  db.fave.findOrCreate({
      where: { songId: req.body.songId },
      // defaults: {
      //   title,
      //   artist,
      //   preview_url
      // },
    })
    .then((fave) => {
      db.fave.findOrCreate({
        where: {
          songId: req.body.songId,
          userId: req.session.passport.user,
          preview_url: req.body.preview_url
        },
      });
      console.log(fave);
    })
    .catch((err) => {
      console.log(err);
    })
    .then((result) => {
      // console.log(req.body.preview_url);
      res.redirect('/profile');
    });
});

// DELETE TRACK FROM FAVES
// router.delete('/faves/:id', async (req, res) => {
//   let trackDeleteId = req.params.id;
//   let trackToDelete = await db.fave.destroy({
//     where: {
//       songId: trackDeleteId,
//       userId: req.session.passport.user
//     },
//   }).catch(err) => {
//     console.log(err);
//   };
//   if (!trackToDelete) {
//     res.render("Error. Try again")
//   } else {
//     res.redirect('/profile')
//   }
// })

// ADD USER'S OWN GENRE LABEL
router.put('/', (req, res) => {

})

// DELETE YOUR GENRE LABEL
router.delete('/faves/:')

module.exports = router;
