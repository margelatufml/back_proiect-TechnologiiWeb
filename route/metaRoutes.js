import express from "express";
import MetaAPI from "../helpers/metaAPI.js";

const metaRoutes = express.Router();

// Post a product to Facebook
metaRoutes.post("/post/facebook", async (req, res) => {
  const { pageAccessToken, pageId, product } = req.body;

  try {
    const message = `Available Product: ${product.continut}
Category: ${product.categorie}
Expires on: ${new Date(product.data_expirare).toLocaleDateString()}`;

    const response = await MetaAPI.postToFacebook({
      pageAccessToken,
      pageId,
      message,
    });
    res
      .status(200)
      .json({ message: "Posted to Facebook successfully!", response });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to post to Facebook", details: error.message });
  }
});

// Post a product to Instagram
metaRoutes.post("/post/instagram", async (req, res) => {
  const { igUserId, accessToken, product } = req.body;

  try {
    const caption = `Available Product: ${product.continut}
Category: ${product.categorie}
Expires on: ${new Date(product.data_expirare).toLocaleDateString()}`;

    const response = await MetaAPI.postToInstagram({
      igUserId,
      accessToken,
      caption,
    });
    res
      .status(200)
      .json({ message: "Posted to Instagram successfully!", response });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to post to Instagram", details: error.message });
  }
});

export default metaRoutes;
