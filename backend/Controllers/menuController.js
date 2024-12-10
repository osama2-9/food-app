import { v2 as cloudinary } from "cloudinary";
import MenuItem from "../Model/Menu.js";
import Restaurant from "../Model/Restaurant.js";
export const addNewItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      restaurantID,
      additions,
      sizes,
      mealType,
      isOffer,
      offerPrice,
      offerValidity,
    } = req.body;
    let { mealImg } = req.body;

    if (!name || !description || !price || !restaurantID || !mealType) {
      return res.status(400).json({
        error: "Please fill all required fields",
      });
    }

    if (isOffer) {
      if (!offerPrice || !offerValidity) {
        return res.status(400).json({
          error:
            "Offer price and offer validity are required when the item is an offer.",
        });
      }
    }

    const existingItem = await MenuItem.findOne({ name });
    if (existingItem) {
      return res.status(400).json({
        error: "This menu item is already added",
      });
    }

    console.log(req.body);

    if (mealImg) {
      try {
        const imgUploadResponse = await cloudinary.uploader.upload(mealImg);
        mealImg = imgUploadResponse.secure_url;
      } catch (imgError) {
        return res.status(500).json({
          error: "Error uploading image",
        });
      }
    }

    const newMenu = new MenuItem({
      name,
      description,
      price,
      restaurant: restaurantID,
      mealImg,
      additions: additions || [],
      sizes: sizes || [],
      createdAt: Date.now(),
      mealType,
      isOffer,
      offerPrice: isOffer ? offerPrice : undefined,
      offerValidity: isOffer ? offerValidity : undefined,
    });

    const created = await newMenu.save();
    return res.status(201).json({
      message: "New menu item created",
      menuItem: created,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    if (!restaurantID) {
      return res.status(400).json({
        error: "Missing required parameters",
      });
    }
    const items = await MenuItem.find({ restaurant: restaurantID });
    if (!items) {
      return res.status(404).json({
        error: "Restaurant not found",
      });
    }
    return res.status(200).json({
      items,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const deleteItem = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return res.status(400).json({
        error: "Missing required parameters",
      });
    }

    const item = await MenuItem.findById(_id);
    if (!item) {
      return res.status(404).json({
        error: "Item not found",
      });
    }

    
    if (item.mealImg) {
      const imgId = item.mealImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    const isDeleted = await item.deleteOne();
    if (!isDeleted) {
      return res.status(400).json({
        error: "Error while trying to delete this item",
      });
    } else {
      return res.status(200).json({
        message: "Item deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};


export const mealDetailes = async (req, res) => {
  try {
    const { mealId } = req.params;
    if (!mealId) {
      return res.status(400).json({
        error: "Missing required params",
      });
    }
    const meal = await MenuItem.findById(mealId);
    if (!meal) {
      return res.status(400).json({
        error: "Meal not found",
      });
    }
    return res.status(200).json({
      meal,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllMenu = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    if (!restaurants || restaurants.length === 0) {
      return res.status(400).json({
        error: "No restaurants found",
      });
    }

    const restaurantIds = restaurants.map((res) => res._id);
    const menu = await MenuItem.find({ restaurant: { $in: restaurantIds } });

    if (!menu || menu.length === 0) {
      return res.status(404).json({
        error: "No menu items found for the restaurants",
      });
    }

    const groupedMenu = restaurants.map((restaurant) => {
      const restaurantMenuItems = menu.filter(
        (item) => item.restaurant.toString() === restaurant._id.toString()
      );

      return {
        restaurant: restaurant.name,
        meals: restaurantMenuItems,
        mealCount: restaurantMenuItems.length,
      };
    });

    return res.status(200).json({
      success: true,
      menu: groupedMenu,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const updateMeal = async (req, res) => {
  try {
    const {
      mealId,
      name,
      description,
      price,
      restaurantID,
      additions,
      sizes,
      mealType,
      isOffer,
      offerValidity,
      isActive,
      offerPrice,
    } = req.body;
    let { mealImg } = req.body;

    if (!mealId) {
      return res.status(400).json({
        error: "No meal found to update. Please try again.",
      });
    }

    const meal = await MenuItem.findById(mealId);
    if (!meal) {
      return res.status(400).json({
        error: "No meal found.",
      });
    }

    if (mealImg) {
      if (meal.mealImg) {
        try {
          const imgId = meal.mealImg.split("/").pop().split(".")[0];
          const deleteImgResult = await cloudinary.uploader.destroy(imgId);

          if (deleteImgResult.result !== "ok") {
            console.error(
              "Error deleting image from Cloudinary:",
              deleteImgResult
            );
            return res.status(400).json({
              error: "Error while trying to delete the old image.",
            });
          }
        } catch (cloudinaryError) {
          console.error(
            "Error deleting old image from Cloudinary:",
            cloudinaryError
          );
          return res.status(500).json({
            error: "Failed to delete the old image from Cloudinary.",
          });
        }
      }

      try {
        const uploadResult = await cloudinary.uploader.upload(mealImg);
        mealImg = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Error uploading new image to Cloudinary:", uploadError);
        return res.status(500).json({
          error: "Failed to upload the new image to Cloudinary.",
        });
      }
    }

    meal.name = name || meal.name;
    meal.price = price || meal.price;
    meal.description = description || meal.description;
    meal.restaurant = restaurantID || meal.restaurant;
    meal.additions = additions || meal.additions;
    meal.sizes = sizes || meal.sizes;
    meal.mealType = mealType || meal.mealType;
    meal.mealImg = mealImg || meal.mealImg;
    meal.isOffer = isOffer !== undefined ? isOffer : meal.isOffer;
    meal.offerValidity = offerValidity || meal.offerValidity;
    meal.isActive = isActive !== undefined ? isActive : meal.isActive;
    meal.offerPrice = offerPrice !== undefined ? offerPrice : meal.offerPrice;

    const updatedMeal = await meal.save();
    if (!updatedMeal) {
      return res.status(400).json({
        error: "Error while trying to update the meal.",
      });
    }

    return res.status(200).json({
      message: "Meal updated successfully.",
    });
  } catch (error) {
    console.error("Error during meal update:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

export const getOffers = async (req, res) => {
  try {
    const offers = await MenuItem.find({ isOffer: true });

    if (!offers || offers.length === 0) {
      return res.status(400).json({
        error: "No offers found",
      });
    }

    const currentDate = new Date();

    const updatedOffers = offers.map((offer) => {
      if (new Date(offer.offerValidity) < currentDate) {
        offer.isActive = false;
        offer.isOffer = false;
        offer.save();
      }
      return offer;
    });

    const restaurantIds = updatedOffers.map((offer) => offer.restaurant);

    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });

    const restaurantMap = restaurants.reduce((acc, restaurant) => {
      acc[restaurant._id.toString()] = restaurant.name;
      return acc;
    }, {});

    const offersDetails = await Promise.all(
      updatedOffers.map(async (offer) => {
        const restaurantName = restaurantMap[offer.restaurant.toString()];

        return {
          offerId: offer._id,
          restaurantName: restaurantName,
          offerName: offer.name,
          offerPrice: offer.offerPrice,
          offerValidity: offer.offerValidity,
          offerStatus: offer.isActive,
          offerDescription: offer.description,
        };
      })
    );

    res.status(200).json({
      offersDetails,
    });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return res.status(500).json({
      error: "An error occurred while fetching offers",
    });
  }
};

export const offerActivationStatus = async (req, res) => {
  try {
    const { offerId } = req.body;

    if (!offerId) {
      return res.status(400).json({
        error: "Please select an offer to update",
      });
    }

    const offer = await MenuItem.findById(offerId);
    if (!offer) {
      return res.status(400).json({
        error: "No offer found",
      });
    }

    offer.isActive = !offer.isActive;

    await offer.save();

    return res.status(200).json({
      message: `Offer ${offer.isActive ? "Activated" : "Deactivated"}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getTopRatedOffers = async (req, res) => {
  try {
    const offers = await MenuItem.find({ isOffer: true });

    if (!offers || offers.length === 0) {
      return res.status(400).json({
        error: "No offers found",
      });
    }

    const sortedOffers = offers
      .sort((a, b) => {
        if (a.rating === undefined && b.rating === undefined) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (a.rating === undefined) return 1;
        if (b.rating === undefined) return -1;
        return b.rating - a.rating;
      })
      .slice(0, 3);

    const currentDate = new Date();

    const updatedOffers = await Promise.all(
      sortedOffers.map(async (offer) => {
        if (new Date(offer.offerValidity) < currentDate) {
          offer.isActive = false;
          await offer.save();
        }
        return offer;
      })
    );

    const restaurantIds = updatedOffers.map((offer) => offer.restaurant);
    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });

    const restaurantMap = restaurants.reduce((acc, restaurant) => {
      acc[restaurant._id.toString()] = restaurant.name;
      return acc;
    }, {});

    const offersDetails = updatedOffers.map((offer) => {
      const restaurantName = restaurantMap[offer.restaurant.toString()];

      return {
        offerId: offer._id,
        offerImg: offer.mealImg,
        restaurantName: restaurantName,
        offerName: offer.name,
        offerPrice: offer.offerPrice,
        offerValidity: offer.offerValidity,
        offerStatus: offer.isActive,
        offerDescription: offer.description,
        isActive: offer.isActive,
      };
    });

    return res.status(200).json({ topRatedOffers: offersDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const { offerId, offerName, offerPrice, offerValidity } = req.body;
    if (!offerId) {
      return res.status(400).json({
        error: "Please select an offer to update",
      });
    }
    if (!offerName || !offerPrice || !offerValidity) {
      return res.status(400).json({
        error: "Please fill all feilds",
      });
    }
    const offer = await MenuItem.findById(offerId);
    if (!offer.isOffer) {
      return res.status(400).json({
        error: "the select meal is not an offer",
      });
    }

    offer.name = offerName || offer.name;
    offer.offerPrice = offerPrice || offer.offerPrice;
    offer.offerValidity = offerValidity || offer.offerValidity;

    const isUpdated = await offer.save();
    if (!isUpdated) {
      return res.status(400).json({
        error: "Error while try to update offer",
      });
    }
    return res.status(200).json({
      message: "Offer updated ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
