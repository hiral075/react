const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Serve static files from the "assests" folder
app.use('/assests', express.static(path.join(__dirname, 'assests')));

// Test route
app.get('/test', (req, res) => {
  res.send('Server is running!');
});

// Prediction route
app.post('/predict', (req, res) => {
  const { currentImageName } = req.body;

  if (!currentImageName) {
    return res.status(400).json({ error: 'Image name is required' });
  }

  const baseName = currentImageName.split('.')[0].replace(/\d+/g, '');
  res.json({ predictedName: baseName });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// const express = require('express');
// const bodyParser = require('body-parser');
// const twilio = require('twilio');


// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Twilio configuration
// const accountSid = 'AC93782383fcbc47c04478ca795aae40cd';
// const authToken = '135dd92d32a43f0b3aaad631330953d0';
// const twilioClient = twilio(accountSid, authToken);
// const twilioPhoneNumber = '+18059185286';

// // Simulated stored OTP for demonstration purposes
// let storedOtp = '123456'; // In a real application, this should be stored securely

// app.post('/send-otp', async (req, res) => {
//     const { phoneNumber } = req.body; // Extract the phone number from the request body

//     if (!phoneNumber) {
//         return res.status(400).json({ success: false, message: "Phone number is required." });
//     }

//     try {
//         // Send OTP using Twilio
//         const message = await twilioClient.messages.create({
//             body: `Your OTP code is: ${storedOtp}`, // Use your actual OTP here
//             from: twilioPhoneNumber,
//             to: phoneNumber, // Use the extracted phone number here
//         });

//         return res.status(200).json({ success: true, messageSid: message.sid });
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// });

// // OTP verification endpoint
// app.post('/verify-otp', (req, res) => {
//     const { otp } = req.body; // Extract the OTP from the request body

//     if (!otp) {
//         return res.status(400).json({ success: false, message: "OTP is required." });
//     }

//     // Verify the OTP
//     if (otp === storedOtp) { // Replace with your logic for OTP verification
//         return res.status(200).json({ success: true, message: "OTP verified successfully." });
//     } else {
//         return res.status(400).json({ success: false, message: "Invalid OTP." });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
