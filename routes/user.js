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

// USER likeS
router.get('/likes', (req, res) => {
    db.like.findAll({
        where: {
            userId: req.session.passport.user
        }
    })
    .then((response) => {
        let likes = response.data.items;
        const spotifyIds = likes.map(likes => {
            return likes.spotify_id
        })
        return db.likes.findAll({
            where: {
                songId: spotifyIds
            }
        })
    })
    .then((likes) => {
        res.render('likes', { likes })
    })
})

// FIND SONGS
router.get("/track/:track", (req, res) => {
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
          `https://api.spotify.com/v1/search?q=${track}&type=track&offset=0&limit=${resultLimit}`,
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



// ADD TRACK TO likes
// This is spitting out TWO new instances...one with the userId and one without
router.post('/', (req, res) => {
  // console.log(req.body);
  db.like.create({
    songId: req.body.songId,
    name: req.body.name,
    artist: req.body.artist,
    preview_url: req.body.preview_url,
    userId: req.session.passport.user,
  }).then((response) => {
    console.log(response.data)
    res.render('likes')
  })
    .catch((err) => {
      console.log(err);
    });
});

// DELETE TRACK FROM likeS
// router.delete('/likes/:id', async (req, res) => {
//   let trackDeleteId = req.params.id;
//   let trackToDelete = await db.like.destroy({
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
router.delete('/likes/:')

module.exports = router;
