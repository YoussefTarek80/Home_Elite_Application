const express = require('express');
const route = express.Router();
const { adValidators, validate } = require("../../../validators/ads.js");
const { authenticateToken } = require('../../../middleware/auth.js');
const upload = require('../../../middleware/upload.js');
const { buy } = require('../../../controllers/user/ads/ads');

// Buy ads routes
route.post('/AddAds',authenticateToken,upload.array('img',10),adValidators,validate,buy.add_ADS);
route.post('/updateSpecificAds/:id',authenticateToken,upload.array('img',10),adValidators,validate,buy.update_Specific_ADS);
route.post('/deleteSpecificAds/:id',authenticateToken,buy.delete_Specific_ADS);
route.post('/DeleteAds/:id',authenticateToken,buy.delete_ADS);
route.post('/AddFavorite/:id',authenticateToken,buy.AddFavorite);
route.post('/DeleteFavorite/:id',authenticateToken,buy.DeleteFavorite);
route.post('/UpdateAds/:id',authenticateToken,upload.single('image'),buy.update_ADS);
route.get('/getRent/:id',authenticateToken, buy.GetSpecificAds);
// route.post('/ViewAds/:id',authenticateToken,buy.viewAd);
route.get('/ShowAds',authenticateToken,buy.get_ADS);
route.get('/searchType/:propertyType',authenticateToken,buy.Search_by_types);
route.get('/searchBedrooms/:number',authenticateToken,buy.Search_by_bedRooms);


module.exports = route;