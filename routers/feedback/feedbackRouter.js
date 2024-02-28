const express = require('express');
const {
  createFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
} = require('../../controllers/feedback/feedback');

const router = express.Router();

router.route('/').get(getFeedback).post(createFeedback).put(updateFeedback).delete(deleteFeedback);
