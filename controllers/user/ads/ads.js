const mongoose = require('mongoose');
const handleAdOperations = require('../../../handler/adsHandlerMethod');
const Buy = require('../../../models/user/ads/buy');
const Rent = require('../../../models/user/ads/rent');
const ads = require('../../../models/user/ads/ads');
// Create handlers for buy and rent ads
const buyHandlers = handleAdOperations(Buy);
const rentHandlers = handleAdOperations(Rent);
const adsHandlers = handleAdOperations(ads);

module.exports = {
    buy: buyHandlers,
    rent: rentHandlers,
    ads:adsHandlers
};