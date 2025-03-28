import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User (Supervisors only)
const register = async (req, res) => {
  try {
    const { firstName, lastName, companyName, email, phoneNumber, address, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'First name, last name, email, and password are required' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      firstName,
      lastName,
      companyName,
      email,
      phoneNumber,
      address,
      password: hashedPassword,
      role: 'supervisor',
    });
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Authenticated User's Profile
const profile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      companyName: req.user.companyName,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      address: req.user.address,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// Edit Profile
const editProfile = async (req, res) => {
  try {
    const { firstName, lastName, companyName, phoneNumber, address, password } = req.body;
    const user = req.user; // From protect middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (companyName) user.companyName = companyName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Delete Profile (Supervisors only)
const deleteProfile = async (req, res) => {
  try {
    const user = req.user; // From protect middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot be deleted via this endpoint' });
    }

    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'Supervisor profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting profile' });
  }
};

export { register, login, profile, editProfile, deleteProfile };