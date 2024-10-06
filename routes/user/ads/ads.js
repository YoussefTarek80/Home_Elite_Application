const express = require('express');
const route = express.Router();
const { adValidators, validate } = require("../../../validators/ads.js");
const { authenticateToken } = require('../../../middleware/auth.js');
const upload = require('../../../middleware/upload.js');
const { ads } = require('../../../controllers/user/ads/ads');

// All ads routes
route.get('/getAds',authenticateToken,ads.get_ADS);
route.post('/ViewAds/:id',authenticateToken,ads.viewAd);
route.post('/AddFavorite/:id',authenticateToken,ads.AddFavorite);
route.post('/DeleteFavorite/:id',authenticateToken,ads.DeleteFavorite);
route.get('/searchType/:propertyType',authenticateToken,ads.Search_by_types);
route.get('/favorite',authenticateToken,ads.GetFavorite);
route.get('/searchBedrooms/:number',authenticateToken,ads.Search_by_bedRooms);
route.get('/properties',authenticateToken,ads.getPropertyTypes);
route.get('/bestADS',authenticateToken,ads.getBestADS);
route.get('/filter',authenticateToken,ads.filter_ADS);
route.get('/UserAds',authenticateToken,ads.GetUserAds);

module.exports = route;

