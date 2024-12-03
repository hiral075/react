const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Twilio configuration
const accountSid = 'ACfc73851062e0270d1eaaeaab4cf0a04f';
const authToken = '67532afce65be10b44da120e33578c29';
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = '+17753805468';

// Simulated stored OTP for demonstration purposes
let storedOtp = '123456'; // In a real application, this should be stored securely

// Serve static files from the "assests" folder
app.use('/assests', express.static(path.join(__dirname, 'assests')));

// Test route to check if the server is running
app.get('/test', (req, res) => {
  res.send('Server is running!');
});

// Prediction route to return the predicted image name
app.post('/predict', (req, res) => {
  const { currentImageName } = req.body;

  if (!currentImageName) {
    return res.status(400).json({ error: 'Image name is required' });
  }

  // Extract base name from the image name, removing digits and file extension
  const baseName = currentImageName.split('.')[0].replace(/\d+/g, '');
  res.json({ predictedName: baseName });
});

// Ground Truth route to return the ground truth image name
app.post('/groundTruth', (req, res) => {
  const { currentImageName } = req.body;

  if (!currentImageName) {
    return res.status(400).json({ error: 'Image name is required' });
  }

  // Extract base name from the image name, removing digits and file extension
  const baseName = currentImageName.split('.')[0].replace(/\d+$/, ''); // Remove digits at the end
  const groundTruthName = baseName; // Use the extracted base name directly for ground truth

  res.json({ groundTruthName });
});

// OTP sending route
app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body; // Extract the phone number from the request body

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "Phone number is required." });
  }

  try {
    // Send OTP using Twilio
    const message = await twilioClient.messages.create({
      body: `Your OTP code is: ${storedOtp}`, // Use your actual OTP here
      from: twilioPhoneNumber,
      to: phoneNumber, // Use the extracted phone number here
    });

    return res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// OTP verification route
app.post('/verify-otp', (req, res) => {
  const { otp } = req.body; // Extract the OTP from the request body

  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required." });
  }

  // Verify the OTP
  if (otp === storedOtp) { // Replace with your logic for OTP verification
    return res.status(200).json({ success: true, message: "OTP verified successfully." });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP." });
  }
});

// Server setup
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
