const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ProductModel = mongoose.model('ProductModel');
const ContactUsModel = mongoose.model('ContactUsModel');
const FeaturedProductModel = mongoose.model('FeaturedProductModel');
const UserModel = mongoose.model('UserModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const protectedResource = require('../middleware/protectedResource');
const { Storage } = require('@google-cloud/storage');

const uploadDir = path.join(__dirname, '../uploads');
router.use('/uploads', express.static(uploadDir));

const storage = new Storage({
  keyFilename: path.join(__dirname, '../storageACKey/sakey.json'), // Update with the correct path
  projectId: 'dauntless-water-412305', // Replace with your project ID
});
const bucket = storage.bucket('shubhamspstorage'); // Replace with your bucket name

const upload = multer({ dest: uploadDir }); // Update destination to use the absolute path

router.post('/addproduct', protectedResource, upload.single('productImage'), async (req, res) => {
  console.log('inside route');
  const { productName, productPrice, productDescription } = req.body;

  if (!productName || !productPrice || !productDescription) {
    console.log('Missing fields');
    return res.status(400).json({ message: 'One or more fields are empty' });
  }

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const filePath = path.join(uploadDir, file.filename);

    // Upload the file to Google Cloud Storage
    const remoteFileName = `${Date.now()}_${file.originalname}`;
    const remoteFile = bucket.file(remoteFileName);

    console.log('after file upload gc');

    fs.createReadStream(filePath)
      .pipe(remoteFile.createWriteStream())
      .on('error', (err) => {
        console.error(err);
        return res.status(500).json({ message: 'Error uploading file. Please try again.' });
      })
      .on('finish', async () => {
        // Delete the local file after successful upload
        fs.unlinkSync(filePath);

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${remoteFileName}`;

        // Save product information to the database
        const productObj = new ProductModel({
          productName,
          productPrice,
          productDescription,
          productImage: publicUrl,
          cartQuantity: 1,
        });

        const newProduct = await productObj.save();
        console.log('Product added');
        res.status(201).json({ product: newProduct });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding the product' });
  }
});
router.post('/addfeatured', protectedResource, upload.single('productImage'), async (req, res) => {
  console.log('inside route');
  const { productName, productPrice, productDescription } = req.body;

  if (!productName || !productPrice || !productDescription) {
    console.log('Missing fields');
    return res.status(400).json({ message: 'One or more fields are empty' });
  }

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const filePath = path.join(uploadDir, file.filename);

    // Upload the file to Google Cloud Storage
    const remoteFileName = `${Date.now()}_${file.originalname}`;
    const remoteFile = bucket.file(remoteFileName);

    console.log('after file upload gc');

    fs.createReadStream(filePath)
      .pipe(remoteFile.createWriteStream())
      .on('error', (err) => {
        console.error(err);
        return res.status(500).json({ message: 'Error uploading file. Please try again.' });
      })
      .on('finish', async () => {
        // Delete the local file after successful upload
        fs.unlinkSync(filePath);

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${remoteFileName}`;

        // Save product information to the database
        const productObj = new FeaturedProductModel({
          productName,
          productPrice,
          productDescription,
          productImage: publicUrl,
          cartQuantity: 1,
        });

        const newProduct = await productObj.save();
        console.log('Product added');
        res.status(201).json({ product: newProduct });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding the product' });
  }
});





// router.post('/addfeatured', protectedResource, upload.single('productImage'), async (req, res) => {
//   const { productName, productPrice, productDescription } = req.body;

//   if (!productName || !productPrice || !productDescription) {
//     console.log('Missing fields');
//     return res.status(400).json({ message: 'One or more fields are empty' });
//   }

//   try {
//     const imageLocation = `/uploads/${req.file.filename}`; // Construct the URL
//     const productObj = new FeaturedProductModel({
//       productName,
//       productPrice,
//       productDescription,
//       productImage: imageLocation, // Store the URL in the productImage field
//       cartQuantity: 1
//     });

//     const newProduct = await productObj.save();
//     console.log('Product added');
//     res.status(201).json({ product: newProduct });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'An error occurred while adding the product' });
//   }
// });



router.get('/search/:searchFor', async (req, res) => {
  try {
    const { searchFor } = req.params;
    const searchLowerCase = searchFor.toLowerCase();

    // Perform a case-insensitive search using the $regex operator
    const filter = {
      $or: [
        { 'productName': { $regex: new RegExp(searchLowerCase, 'i') } },
        { 'productDescription': { $regex: new RegExp(searchLowerCase, 'i') } },
      ],
    };

    // Perform the search using ProductModel.find() with the constructed filter
    const searchResult = await ProductModel.find(filter);

    console.log(searchResult);

    if (searchResult.length === 0) {
      return res.status(404).json({ success: false });
    }

    // Send the search result as a response
    return res.json({ success: true, result: searchResult });

  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});






router.get('/getfeatured', async (req, res) => {
  try {

    const products = await FeaturedProductModel.find()

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});


router.get('/productdetails/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId)
    const productDetails = await ProductModel.findById(productId);

    if (!productDetails) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ productDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during fetching details of the product' });
  }
});

router.get('/fproductdetails/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId)
    const productDetails = await FeaturedProductModel.findById(productId);

    if (!productDetails) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ productDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during fetching details of the product' });
  }
});



router.post('/oldaddreview', async (req, res) => {
  try {
    console.log("entered");
    const { review, productId, useremail } = req.body;

    console.log(review);
    console.log(productId);

    if (!review || !productId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Instead of pushing an object, you should push an object with properties
    product.productReviews.push({
      review: review,
      useremail: useremail
    });

    await product.save(); // Save the updated product with the new review

    console.log('Review added');
    return res.status(201).json({ message: 'Product review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during adding product review' });
  }
});

router.post('/addreview', async (req, res) => {
  try {
    console.log("entered");
    const { review, productId, useremail } = req.body;

    console.log(review);
    console.log(productId);

    if (!review || !productId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let product = await ProductModel.findById(productId);

    if (!product) {
      // If the product is not found in ProductModel, check FeaturedProductModel
      product = await FeaturedProductModel.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    // Instead of pushing an object, you should push an object with properties
    product.productReviews.push({
      review: review,
      useremail: useremail
    });

    await product.save(); // Save the updated product with the new review

    console.log('Review added');
    return res.status(201).json({ message: 'Product review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during adding product review' });
  }
});




router.post('/addtocart/:useremail', async (req, res) => {
  try {
    const { useremail } = req.params;
    const { product } = req.body;

    // Find the user by their email
    const user = await UserModel.findOne({ email: useremail });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'Please login first' });
    }

    // Check if the product is already in the user's cart
    const isProductInCart = user.cart.some(cartProduct => cartProduct.productName === product.productName);

    if (isProductInCart) {
      console.log("Product is already in the cart");
      return res.status(400).json({ error: 'Product is already in the cart' });
    }

    // Add the product to the user's cart
    user.cart.push(product);

    // Save the user with the updated cart
    await user.save();
    console.log(user.cart);

    console.log("Added to cart");
    return res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



// Define the IST timezone
const istTimeZone = 'Asia/Kolkata'; // IST timezone

router.post('/orderFinal/:userCart/:useremail', async (req, res) => {
  try {
    const { useremail, userCart } = req.params;

    // Find the user by their email
    const user = await UserModel.findOne({ email: useremail });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove products from the user's cart and add them to the orders array
    const removedProducts = [];
    user.cart = user.cart.filter((product) => {
      if (userCart.includes(product)) {
        removedProducts.push(product);
        return false; // Exclude the product from the cart
      }
      return true; // Keep other products in the cart
    });

    // Create an Intl.DateTimeFormat object with the IST timezone
    const istFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: istTimeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3, // Include milliseconds
    });

    // Format the current date and time in IST
    const istDate = istFormatter.format(new Date());

    // Save the removed products and IST formatted date in the orders array
    user.orders.push({
      products: removedProducts,
      date: istDate, // Save the date in IST format
    });

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'Order placed' });
  } catch (error) {
    console.error("Failed to order:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});






router.get('/getcart/:useremail', async (req, res) => {
  try {
    const { useremail } = req.params;


    // Find the user by their email
    const user = await UserModel.findOne({ email: useremail });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    const usercart = user.cart
    // console.log(usercart)


    return res.status(200).json({ usercart, message: 'cart' });
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getorders/:useremail', async (req, res) => {
  try {
    const { useremail } = req.params;


    // Find the user by their email
    const user = await UserModel.findOne({ email: useremail });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    const userorders = user.orders
    // console.log(usercart)


    return res.status(200).json({ userorders, message: 'Product added to cart' });
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/removepcart/:productName/:useremail', protectedResource, async (req, res) => { // Modified the route parameter to accept productName
  try {
    const productName = req.params.productName;

    // Find the user by their email
    const useremail = req.params.useremail

    const user = await UserModel.findOne({ email: useremail });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    const userCart = user.cart;

    // Remove the product from the user's cart
    const updatedCart = userCart.filter(item => item.productName !== productName);

    // Update the user's cart with the modified cart
    user.cart = updatedCart;
    await user.save();

    console.log("Product removed");

    return res.json({ success: true, message: 'Product removed successfully.' });
  } catch (error) {
    console.log(error);
    // Handle any errors here
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



router.put('/cartplus/:productName/:useremail', async (req, res) => {
  try {
    const productName = req.params.productName;
    const useremail = req.params.useremail;

    // Find the user by their email
    const user = await UserModel.findOne({ email: useremail });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    const productIndex = user.cart.findIndex(item => item.productName === productName);

    if (productIndex === -1) {
      console.log("Product not found in user's cart");
      return res.status(404).json({ error: 'Product not found in user\'s cart' });
    }

    // Increment the quantity by 1
    user.cart[productIndex].cartQuantity += 1;

    // Save the updated user using findByIdAndUpdate
    await UserModel.findByIdAndUpdate(user._id, { cart: user.cart });

    usercart = user.cart

    console.log("Updated cart quantity");
    res.json({ usercart }); // Return the updated cart

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.put('/cartminus/:productName/:useremail', async (req, res) => {
  try {
    const productName = req.params.productName;
    const useremail = req.params.useremail;

    // Find the user by their email
    const user = await UserModel.findOne({ email: useremail });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    const productIndex = user.cart.findIndex(item => item.productName === productName);

    if (productIndex === -1) {
      console.log("Product not found in user's cart");
      return res.status(404).json({ error: 'Product not found in user\'s cart' });
    }

    // Decrement the quantity by 1

    if (user.cart[productIndex].cartQuantity == 1) {
      return res.json("Cannot be less than 1"); // Return the updated cart
    }

    user.cart[productIndex].cartQuantity -= 1;

    // Save the updated user using findByIdAndUpdate
    await UserModel.findByIdAndUpdate(user._id, { cart: user.cart });

    usercart = user.cart

    console.log("Updated cart quantity");
    res.json({ usercart }); // Return the updated cart

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/getproducts', async (req, res) => {
  try {

    const products = await ProductModel.find()

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});

router.get('/getproductsforwomen', async (req, res) => {
  try {
    const products = await ProductModel.find({
      productDescription: { $regex: /women|womens/i } // i flag for case-insensitive search
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});

router.get('/womendresses', async (req, res) => {
  try {
    const products = await ProductModel.find({
      $or : [
        {productName : {$regex: /dress for women|dresses for women|dress for womens|dresses for womens|women dress|women dresses/i}},
        {productDescription: { $regex: /women dresses|women dress|dress for women|dresses for women|dresses for womens/i }} // i flag for case-insensitive search}
      ]
      
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});

router.get('/womenpants', async (req, res) => {
  try {
    const products = await ProductModel.find({
      $or: [
        { productName: { $regex: /pants for women|pant for women|womens pant/i } },
        { productDescription: { $regex: /women pants|women pant|pant for women|pants for women|pants for womens/i } }
      ]
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});


router.get('/womenskirts', async (req, res) => {
  try {
    const products = await ProductModel.find({
      $or: [
        { productName: { $regex: /skirt|skirts/i } },
        { productDescription: { $regex: /women skirts|skirts|skirt|women skirt|skirt for women|skirts for women|skirts for womens/i } }
      ]
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});




router.get('/getproductsformen', async (req, res) => {
  try {
    const products = await ProductModel.find({
      productDescription: { $regex: /\b(men|mens)\b/i } // i flag for case-insensitive search
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});


router.get('/getproductsforkids', async (req, res) => {
  try {
    const products = await ProductModel.find({
      productDescription: { $regex: /kid|kids/i } // i flag for case-insensitive search
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});


router.get('/menshirts', async (req, res) => {
  try {
    const products = await ProductModel.find({
      $or : [

        { productDescription: { $regex: /mens shirts|men shirts|shirt for men|shirts for men|shirts for mens/i }}, // i flag for case-insensitive search
        { productName : {$regex : /shirt for men|shirts for men|shirt for mens|shirts for mens|mens shirts|men shirts/i} }


      ]
     
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});

router.get('/menpants', async (req, res) => {
  try {
    const products = await ProductModel.find({
      $or: [
        { productName: { $regex: /pant for men|pants for men|mens pant|mens pants/i } },
        { productDescription: { $regex: /mens pants|men pants|pant for men|pants for men|pants for mens/i } }
      ]
    });

    console.log("/menpants");
    console.log(products);

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});


router.get('/menhoodies', async (req, res) => {
  try {
    const products = await ProductModel.find({
      productDescription: { $regex: /mens hoodies|men hoodies|hoodie for men|hoodies for men|hoodies for mens/i } // i flag for case-insensitive search
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching products' });
  }
});



router.delete('/removeproduct/:productName', async (req, res) => {
  try {
    const productName = req.params.productName;

    // Find the product to get the productImage URL
    const product = await ProductModel.findOne({ productName });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Delete the product from MongoDB
    await ProductModel.findOneAndDelete({ productName });

    console.log('Product Removed');

    // Check if the product has an associated image
    if (product.productImage) {
      // Extract the file name from the productImage URL
      const fileName = product.productImage.replace(`https://storage.googleapis.com/${bucket.name}/`, '');

      // Delete the file from Google Cloud Storage
      await bucket.file(fileName).delete();

      console.log('File Removed from Google Cloud Storage');
    }

    return res.json({ success: true, message: 'Product removed successfully.' });
  } catch (error) {
    console.error(error);
    // Handle any errors here
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
router.delete('/removefproduct/:productName', async (req, res) => {
  try {
    const productName = req.params.productName;

    // Find the product to get the productImage URL
    const product = await FeaturedProductModel.findOne({ productName });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Delete the product from MongoDB
    await FeaturedProductModel.findOneAndDelete({ productName });

    console.log('Product Removed');

    // Check if the product has an associated image
    if (product.productImage) {
      // Extract the file name from the productImage URL
      const fileName = product.productImage.replace(`https://storage.googleapis.com/${bucket.name}/`, '');

      // Delete the file from Google Cloud Storage
      await bucket.file(fileName).delete();

      console.log('File Removed from Google Cloud Storage');
    }

    return res.json({ success: true, message: 'Product removed successfully.' });
  } catch (error) {
    console.error(error);
    // Handle any errors here
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// router.delete('/removefproduct/:productName', protectedResource, async (req, res) => { // Modify the route parameter to accept productName
//   try {
//     const productName = req.params.productName;

//     const product = await FeaturedProductModel.findOneAndDelete({ productName });

//     console.log("Product Removed")

//     return res.json({ success: true, message: 'Product removed successfully.' });
//   } catch (error) {
//     console.log(error);
//     // Handle any errors here
//     return res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });


router.post('/contactus', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const newQuery = new ContactUsModel({
      name,
      message,
      email,
    });

    await newQuery.save();
    
    // Optionally, you can send a success response
    res.status(201).json({ message: 'Form data successfully submitted.' });

  } catch (error) {
    console.error('Error submitting form data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.get('/contactus', async (req, res) => {
  try {
    // Execute the query and wait for the results
    const contactedBy = await ContactUsModel.find();

    // console.log(contactedBy);

    // Optionally, you can send a success response
    res.status(200).json({ contactedBy: contactedBy });

  } catch (error) {
    console.error('Error :', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


module.exports = router;
