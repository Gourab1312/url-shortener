import Urls from "../../models/urls";
import connectMongo from "../../utils/connectMongo";

export default async function handler(req, res) {
  try {
    // Use destructuring to directly get the 'code' from req.query
    const { code } = req.query;

    // Connect to the MongoDB database
    await connectMongo();

    // Find the URL document with the provided code
    const data = await Urls.findOne({ code });

    // If the document is found, increment the click count, save, and redirect to the original URL
    if (data) {
      data.clicked += 1;
      await data.save();
      return res.redirect(data.url);
    }

    // If no document is found, return a 404 status
    return res.status(404).json({ error: "URL not found" });
  } catch (error) {
    console.error("Error:", error);
    // Return a 500 status and a meaningful error response
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
