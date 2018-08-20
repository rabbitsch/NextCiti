const axios = require('axios');
const express = require('express');

const router = express.Router();

const WOLFRAM_BASE_URL = 'http://api.wolframalpha.com/v2/query'
const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID

console.log({ WOLFRAM_APP_ID: process.env.WOLFRAM_APP_ID });

const WOLFRAM_API_URL = `${WOLFRAM_BASE_URL}?appid=${WOLFRAM_APP_ID}&output=json`

router.get('/', (req, res) => {
  axios.get(`${WOLFRAM_API_URL}&input=${req.query.input}`)
    .then((payload) => {
      res.json(payload.data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong while querying Wolfram Alpha'
      })
    })
});

module.exports = router;
