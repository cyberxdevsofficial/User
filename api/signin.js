const dbConnect = require('../lib/mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple fallback secret. IMPORTANT: Change this to a real secret in Vercel Env Vars (JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || "change_this_to_a_random_secret_string_12345";

const User = mongoose.models.User; 

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  await dbConnect();

  try {
    // Re-init model if missing (cold start safety)
    if (!mongoose.models.User) {
        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String
        });
        mongoose.model('User', UserSchema);
    }
    
    const user = await mongoose.models.User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Login successful', token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
