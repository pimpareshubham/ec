const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const {MONGODB_URL} = require('./config')

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  app.listen(5000,()=>{
    console.log("Server started")
  })

  

  require('./models/user_model')
  require('./models/product_model')
  require('./models/contactus_model')
  require('./models/featured_product_model')
  app.use(require('./routes/user_route'))
  app.use(require('./routes/product_route'))

  
 




  