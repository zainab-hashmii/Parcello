require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user',      require('./routes/user'));
app.use('/api/Customer',  require('./routes/customer'));
app.use('/api/rider',     require('./routes/rider'));
app.use('/api/parcel',    require('./routes/parcel'));
app.use('/api/Batch',     require('./routes/batch'));
app.use('/api/parcelLog', require('./routes/parcelLog'));
app.use('/api/Payment',   require('./routes/payment'));
app.use('/api/Location',  require('./routes/location'));
app.use('/api/Rating',    require('./routes/rating'));
app.use('/api/route',     require('./routes/route'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB — parcello');
    app.listen(process.env.PORT, () => {
      console.log(`Parcello backend running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
