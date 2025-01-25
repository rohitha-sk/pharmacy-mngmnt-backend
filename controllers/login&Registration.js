import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

//register a user
const registerUser = async (req, res) => {
  const { email, role, password } = req.body;

  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save the user with the hashed password
      const newUser = new User({
          email,
          role,
          password: hashedPassword,
      });

      await newUser.save();
      
      res.status(201).json({
          message: 'User registered successfully',
          user: { email: newUser.email, role: newUser.role }  // You can send additional user info if needed
      });
  } catch (error) {
      console.error("Error during registration:", error);  // Log the full error
      res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};



//retrieve user information
const loginUser = async (req, res) => {
  const { email, password } = req.body;  // No need for 'role' in login request, only email and password

  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Compare the entered password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a new token for the user
      const token = jwt.sign(
          { userId: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET,  // Use your JWT_SECRET here
          { expiresIn: '1h' }      // Token expiration time
      );

      // Respond with the token and user data
      res.status(200).json({
          message: 'Login successful',
          token,  // Send the token in the response
          user: { email: user.email, role: user.role }
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};



export {registerUser, loginUser};