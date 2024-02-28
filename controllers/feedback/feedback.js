const asyncHandler = require('express-async-handler');

const createFeedback = asyncHandler((req, res) => {});
const getFeedback = asyncHandler((req, res) => {});
const updateFeedback = asyncHandler((req, res) => {});
const deleteFeedback = asyncHandler((req, res) => {});

module.exports = {
  createFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
};
