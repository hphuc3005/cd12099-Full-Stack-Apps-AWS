import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';



// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */
app.get('/filteredimage', async (req, res) => {

  const { image_url } = req.query;

  if (!image_url) {
    const errorMessage = 'Image URL is missing or invalid'
    console.error(errorMessage);
    return res.status(400).send({ message: errorMessage });
  }

  try {
    const imageFile = await filterImageFromURL(image_url);
    if (!imageFile) {
      const errorMessage = `Cannot filter image from URL = ${image_url}`
      console.error(errorMessage);
      return res.status(400).send({ message: errorMessage });
    }
    res.status(200).sendFile(imageFile, (err) => {
      if (err) {
        console.error('Cannot send the filtered image due to error:', err);
      }
      deleteLocalFiles([imageFile]);
    });

  } catch (error) {
    const errorMessage = `There is an error: ${error}`
    console.error(errorMessage);
    res.status(500).send({ message: errorMessage });
  }
});

//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});


// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
