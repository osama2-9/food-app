import Offer from "../Model/Offer.js";
import { v2 as cloudinary } from "cloudinary";
export const createOffer = async (req, res) => {
  try {
    const { restaurntId, name, description, price, validity } = req.body;
    let { img } = req.body;

    if (!restaurntId || !name || !description || !price || !validity || !img) {
      return res.status(400).json({
        error: "Please fill all form ",
      });
    }
    if(img){
        const upload = await cloudinary.uploader.upload(img)
        img = upload.secure_url
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
