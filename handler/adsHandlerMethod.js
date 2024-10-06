const axios = require('axios');
const mongoose = require('mongoose');
const path = require("path");
const User=require('../models/user/auth');
const Category=require('../models/admin/categaroy');
const propertyTypes=require('../models/admin/categaroy');

const handleAdOperations = (AdModel) => ({
    add_ADS: async (req, res) => {
        try {
            const {
                name, salary, available, propertyType, phone, email,
                Area, Bedrooms, Bathrooms, title, Description, Address, Payment_option, FinalTotal, rentDuration,Insurance,DownPayment
            } = req.body;
            const userId = req.user.userid;
            const categoryExists = await Category.findById(propertyType).exec();
            if (!categoryExists) {
                return res.status(400).json({ message: "Invalid category selected." });
            }
            const Type= new AdModel();
            console.log(Type.adType==='rent')
            if (Type.adType === 'buy' && !FinalTotal) {
                return res.status(400).json({ message: "Final total is required for buy ads." });
            }
            if (Type.adType === 'rent' && (!rentDuration || !Insurance || !DownPayment)) {
                return res.status(400).json({ message: "More Information is required for rent ads." });
            }
            const imageUrls = req.files.map(file => ({
                data: file.path, 
                contentType: file.mimetype,
            }));
            const newAd = new AdModel({
                name,
                salary,
                available,
                propertyType,
                phone,
                email,
                Area,
                Bedrooms,
                Bathrooms,
                title,
                Description,
                Address,
                Payment_option,
                FinalTotal,
                rentDuration,
                DownPayment,
                Insurance,
                user: userId,
                img: imageUrls
            });
            await newAd.save();
            await User.findByIdAndUpdate(userId, { $push: { ads: newAd._id } });
            res.status(201).json({ message: "Ad added successfully", ad: newAd._id });
        } catch (err) {
            console.error("Error adding ad:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    delete_Specific_ADS: async (req, res) => {
        try {
            const adId = req.params.id;
            const userId = req.user.userid;
            const ad = await AdModel.findById(adId);
            if (!ad) {
                return res.status(404).json({ message: "Ad not found." });
            }
            await AdModel.findByIdAndDelete(adId);
            await User.findByIdAndUpdate(userId, { $pull: { ads: adId } });
            res.status(200).json({ message: "Ad deleted successfully." });
        } catch (err) {
            console.error("Error deleting ad:", err);
            res.status(500).json({ message: "Internal server error." });
        }
    },
    update_Specific_ADS: async (req, res) => {
        try {
            const adId = req.params.id;
            const userId = req.user.userid;
            console.log(adId)
            const {
                name, salary, available, propertyType, phone, email,
                Area, Bedrooms, Bathrooms, title, Description, Address, Payment_option, FinalTotal, rentDuration
            } = req.body;
            const ad = await AdModel.findById(adId);
            if (!ad) {
                return res.status(404).json({ message: "Ad not found." });
            }
            
            const categoryExists = await Category.findById(propertyType).exec();
            if (!categoryExists) {
                return res.status(400).json({ message: "Invalid category selected." });
            }
            const Type= new AdModel();
            console.log(Type.adType==='rent')
            if (Type.adType === 'buy' && !FinalTotal) {
                return res.status(400).json({ message: "Final total is required for buy ads." });
            }
            if (Type.adType === 'rent' && (!rentDuration || !Insurance || !DownPayment)) {
                return res.status(400).json({ message: "More Information is required for rent ads." });
            }
            ad.name = name || ad.name;
            ad.salary = salary || ad.salary;
            ad.available = available || ad.available;
            ad.propertyType = propertyType || ad.propertyType;
            ad.phone = phone || ad.phone;
            ad.email = email || ad.email;
            ad.Area = Area || ad.Area;
            ad.Bedrooms = Bedrooms || ad.Bedrooms;
            ad.Bathrooms = Bathrooms || ad.Bathrooms;
            ad.title = title || ad.title;
            ad.Description = Description || ad.Description;
            ad.Address = Address || ad.Address;
            ad.Payment_option = Payment_option || ad.Payment_option;
            ad.FinalTotal = FinalTotal || ad.FinalTotal;
            ad.rentDuration = rentDuration || ad.rentDuration;
            await ad.save();
            res.status(200).json({ message: "Ad updated successfully", ad });
        } catch (err) {
            console.error("Error updating ad:", err);
            res.status(500).json({ message: "Internal server error." });
        }
    },
    get_ADS: async (req, res) => {
        try {
            const ads = await AdModel.find().populate('propertyType', 'PropertyType');
            res.status(200).json(ads);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    AddFavorite: async (req, res) => {
        try {
            const userId = req.user.userid;
            const adsID = req.params.id;    
            const user = await User.findById(userId);  
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            console.log(adsID)
            const isAlreadyFavorite = user.favorite.some(fav => fav.ad && fav.ad.toString() === adsID);
            if (!isAlreadyFavorite) {
                user.favorite.push({ ad: adsID, isFavorite: true });
                await user.save(); 
                const addedFavorite = user.favorite.find(fav => fav.ad.toString() === adsID);
                return res.status(200).json({
                    message: "Ad added to favorites done",
                    favorite: {
                        ad: adsID,
                        isFavorite: addedFavorite.isFavorite
                    }
                });
            } else {
                return res.status(201).json({ message: "Ad already added" });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    DeleteFavorite: async (req, res) => {
        try {
            const userId = req.user.userid;
            const adsID = req.params.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const isFavorite = user.favorite.some(fav => fav.ad && fav.ad.toString() === adsID);
            if (!isFavorite) {
                return res.status(404).json({ message: "Ad is not in favorites" });
            }
            user.favorite = user.favorite.filter(fav => fav.ad.toString() !== adsID);
            await user.save();
            res.status(200).json({ message: "Ad deleted from favorites" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    GetFavorite: async (req, res) => {
        try {
            const userId = req.user.userid; 
            const user = await User.findById(userId); 
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const favoriteMap = {};
            user.favorite.forEach(fav => {
                if (fav.ad) {
                    favoriteMap[fav.ad.toString()] = fav.isFavorite;
                }
            });
            const favoriteAdIds = user.favorite
                .filter(fav => fav.ad) 
                .map(fav => fav.ad);
            if (!favoriteAdIds.length) {
                return res.status(200).json({ message: "No favorite ads found", favoriteAds: [] });
            }
            const favoriteAds = await AdModel.find({ _id: { $in: favoriteAdIds } })
                .populate('propertyType', 'PropertyType');
            if (!favoriteAds.length) {
                return res.status(200).json({ message: "No matching ads found for the provided favorite IDs" });
            }
            const favoriteAdsWithIsFavorite = favoriteAds.map(ad => {
                const adObj = ad.toObject();
                adObj.isFavorite = favoriteMap[ad._id.toString()] || false;
                return adObj;
            });
            res.status(200).json({ favoriteAds: favoriteAdsWithIsFavorite });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },   
    delete_ADS: async (req, res) => {
        try {
            const { adId } = req.params;
            await AdModel.findByIdAndDelete(adId);
            res.status(200).json({ message: 'Ad deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update_ADS: async (req, res) => {
        try {
            const { adId } = req.params;
            const updateData = req.body;
            const updatedAd = await AdModel.findByIdAndUpdate(adId, updateData, { new: true });
            if (!updatedAd) return res.status(404).json({ message: 'Ad not found' });
            res.status(200).json({ message: 'Ad updated successfully', updatedAd });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    viewAd: async (req, res) => {
        try {
            const  adId  = req.params.id;
            const userId = req.user.userid;
            const ad = await AdModel.findById(adId);
            if (!ad) return res.status(404).json({ message: 'Ad not found' });
            if (ad.user.toString() !== userId) {
                if (!ad.viewedBy.includes(userId)) {
                    ad.views += 1;
                    ad.viewedBy.push(userId);
                }
            } else {
                return res.status(200).json({ message: 'You are the owner of this ad', ad });
            }
            await ad.save();
            res.status(200).json(ad);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getPropertyTypes:async (req,res)=>{
        try{
            const allProperties=await propertyTypes.find()
            res.json(allProperties)
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getBestADS:async(req,res)=>{
        try{
            const bestAds = await AdModel.find().populate('propertyType', 'PropertyType').sort({ views: -1 }).limit(3);
            res.status(200).json(bestAds);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    filter_ADS: async (req, res) => {
        try {
            const { bedrooms, minSalary, maxSalary, bathrooms, propertyType } = req.body;
            let query = {};
            
            if (bedrooms) {
                query.Bedrooms = bedrooms;
            }
            if (bathrooms) {
                query.Bathrooms = bathrooms;
            }
            if (minSalary || maxSalary) {
                query.salary = {};
                if (minSalary) {
                    query.salary.$gte = minSalary;
                }
                if (maxSalary) {
                    query.salary.$lte = maxSalary;
                }
            }
            if (propertyType === 'rent') {
                query.adType=propertyType
            } else if (propertyType === 'buy') {
                query.adType=propertyType
            } 
            const filteredAds = await AdModel.find(query).populate('propertyType', 'PropertyType');
            res.status(200).json(filteredAds);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    Search_by_types: async (req, res) => {
        try {
            const propType = req.params.propertyType;
            const ads = await AdModel.find({ propertyType: propType });
            res.status(200).json(ads);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    Search_by_bedRooms: async (req, res) => {
        try {
            const bedrooms = req.params.number;
            const ads = await AdModel.find({ Bedrooms: bedrooms });
            res.status(200).json(ads);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    GetUserAds:async (req,res)=>{
        try{
            const userId = req.user.userid;
            const user=await User.findById(userId);
            if(!user){
                return res.status(404).json({ message: "User not found" });
            }
            const userAdsIds =  user.ads;
            const userAds = await AdModel.find({ _id: { $in: userAdsIds } })
            .populate('propertyType', 'PropertyType'); 
        
            if (!userAds.length) {
                return res.status(200).json({ message: "No ads found for this user" });
            }
            
            res.status(200).json({ userAds })
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    GetSpecificAds:async (req,res)=>{
        try{
            const userId = req.user.userid;
            const id=req.params.id;
            const user=await User.findById(userId);
            if(!user){
                return res.status(404).json({ message: "User not found" });
            }
            const ad = await AdModel.findById(id).populate('propertyType', 'PropertyType');
            if (!ad) {
                return res.status(404).json({ message: "Ad not found" });
            }
            
            res.status(200).json({ ad })
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    
});

module.exports = handleAdOperations;
