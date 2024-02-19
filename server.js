const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/nexus_info', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create MongoDB schema
const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', CustomerSchema);

// Endpoint to handle form submissions
app.post('/submit_form', (req, res) => {
  const { name, email, address, phone, message } = req.body;

  const newCustomer = new Customer({
    name,
    email,
    address,
    phone,
    message
  });

  newCustomer.save()
    .then(() => res.status(200).json({ success: true, message: 'Form submitted successfully' }))
    .catch(err => res.status(500).json({ success: false, message: 'Form submission failed', error: err }));
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
