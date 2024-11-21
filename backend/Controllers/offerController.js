import Offer from "../Model/Offer.js";
import { v2 as cloudinary } from "cloudinary";
import Restaurant from "../Model/Restaurant.js";
export const createOffer = async (req, res) => {
  try {
    const { restaurntId, name, description, price, validity } = req.body;
    let { img } = req.body;

    if (!restaurntId || !name || !description || !price || !validity || !img) {
      return res.status(400).json({
        error: "Please fill all form ",
      });
    }
    if (img) {
      const upload = await cloudinary.uploader.upload(img);
      img = upload.secure_url;
    }
    const newOffer = new Offer({
      restaurntId,
      name,
      description,
      price,
      validity,
      img,
    });
    const saveNewOffer = await newOffer.save();
    if (!saveNewOffer) {
      return res.status(400).json({
        error: "Error while try to create offer",
      });
    }
    return res.status(201).json({
      message: "New offer created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllOffer = async (req, res) => {
  try {
    const offers = await Offer.find();
    if (!offers || offers.length === 0) {
      return res.status(400).json({
        error: "No offers found",
      });
    }

    const restaurantIds = offers.map((offer) => offer.restaurntId);

    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });

    const restaurantMap = restaurants.reduce((acc, restaurant) => {
      acc[restaurant._id.toString()] = restaurant;
      return acc;
    }, {});

    const offersDetails = offers.map((offer) => {
      const restaurant = restaurantMap[offer.restaurntId.toString()];

      return {
        offerId: offer._id,
        restaurantName: restaurant ? restaurant.name : null,
        offerPrice: offer.price,
        offerName: offer.name,
        offerStatus: offer.isActive,
        offerImg: offer.img,
        offerDescription: offer.description,
        offerTotalOrder: offer.totalOrders,
        offerValidity: offer.validity,
      };
    });

    return res.status(200).json({ offersDetails });
  } catch (error) {
    console.error("Error fetching offers and restaurants:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const updateActivicationStatus = async (req, res) => {
  try {
    const { offerId } = req.body;
    if (!offerId) {
      return res.status(400).json({
        error: "Please select an offer to update",
      });
    }
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(400).json({
        error: "No offer found to update",
      });
    }
    offer.isActive = !offer.isActive;
    const isStatusUpdated = await offer.save();
    if (!isStatusUpdated) {
      return res.status(400).json({
        error: "Error while update the offer",
      });
    }
    return res.status(200).json({
      message: "Offer status updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    if (!offerId) {
      return res.status(400).json({
        error: "Please select an offer to delete",
      });
    }
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(400).json({
        error: "No offer found",
      });
    }
    if (offer.img) {
      const imgId = offer.img.split("/").pop().split(".")[0];
      const deleteResault = await cloudinary.uploader.destroy(imgId);
    }
    const isOfferDeleted = await offer.deleteOne();
    if (!isOfferDeleted) {
      return res.status(400).json({
        error: "Error while try to delete the offer",
      });
    }
    return res.status(200).json({
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Internal server error",
    });
  }
};

export const updateOffer = async (req, res) => {
  console.log(req.body);

  try {
    const { offerId, offerName, offerDescription, offerPrice, offerValidity } =
      req.body;

    if (!offerId) {
      return res.status(400).json({
        error: "Please select offer to update",
      });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(400).json({
        error: "No offer found",
      });
    }

    offer.name = offerName || offer.name;
    offer.description = offerDescription || offer.description;
    offer.price = offerPrice || offer.price;
    offer.validity = offerValidity || offer.validity;

    const isOfferUpdated = await offer.save();

    if (!isOfferUpdated) {
      return res.status(400).json({
        error: "Error while trying to update the offer",
      });
    }

    return res.status(200).json({
      message: "Offer updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getRestaurntOffers = async (req, res) => {
  try {
    const { restaurntId } = req.params;
    if (!restaurntId) {
      return res.status(400).json({
        error: "No restaurnt selected",
      });
    }
    const offers = await Offer.find({ restaurntId: restaurntId });
    if (!offers) {
      return res.status(400).json({
        errro: "No offers found",
      });
    }
    const offersDetails = offers.map((offer) => {
      return {
        offerId: offer._id,
        name: offer.name,
        img: offer.img,
        description: offer.description,
        price: offer.price,
        validity: offer.validity,
        isActive: offer.isActive,
      };
    });
    return res.status(200).json({
      offersDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Internal server error",
    });
  }
};

export const getOfferDetails = async (req, res) => {
  try {
    const { offerId } = req.params;
    if (!offerId) {
      return res.status(400).json({
        error: "Please select offer to see details",
      });
    }
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(400).json({
        error: "No offer found",
      });
    }
    return res.status(200).json({
      offer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
