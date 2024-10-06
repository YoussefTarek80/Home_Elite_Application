const express = require('express');
const route = express.Router();
const { adValidators, validate } = require("../../../validators/ads.js");
const { authenticateToken } = require('../../../middleware/auth.js');
const upload = require('../../../middleware/upload.js');
const { rent } = require('../../../controllers/user/ads/ads');

// Rent ads routes
route.post('/rent/add_ADS',authenticateToken,upload.array('img',10),adValidators,validate, rent.add_ADS);
route.post('/updateSpecificAds/:id',authenticateToken,upload.array('img',10),adValidators,validate,rent.update_Specific_ADS);
route.post('/deleteSpecificAds/:id',authenticateToken,rent.delete_Specific_ADS);
route.get('/getAds',authenticateToken, rent.get_ADS);
route.get('/rent/searchType/:propertyType',authenticateToken, rent.Search_by_types);
route.get('/rent/searchBedrooms/:number',authenticateToken, rent.Search_by_bedRooms);
route.post('/rent/AddFavorite/:id',authenticateToken, rent.AddFavorite);
route.delete('/rent/favorite',authenticateToken, rent.DeleteFavorite);
route.delete('/rent/:adId',authenticateToken, rent.delete_ADS);
route.put('/rent/:adId',authenticateToken, rent.update_ADS);
route.get('/rent/:adId',authenticateToken, rent.viewAd);
route.get('/getRent/:id',authenticateToken, rent.GetSpecificAds);

module.exports = route;