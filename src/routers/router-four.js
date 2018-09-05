const axios = require('axios');
const express = require('express');
const qs = require('querystring')

const router = express.Router();

const FOUR_BASE_URL = `https://api.foursquare.com/v2/venues/explore`

const FOURCLIENT_ID = process.env.FOURCLIENT_ID
const FOURCLIENT_SECRET = process.env.FOURCLIENT_SECRET

console.log({ FOURCLIENT_ID:process.env.FOURCLIENT_ID });

router.get('/', (req, res) => {
  axios.get(`${FOUR_BASE_URL}?near=${req.query.near}`, {
    params: {
      near: req.query.input,
      client_id: FOURCLIENT_ID,
      client_secret: FOURCLIENT_SECRET,
      v: '20180823',
      limit: 15

    }
  })
    .then((payload) => {
      res.json(payload.data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong while querying Four Square'
      })
    })
});

module.exports = router;
