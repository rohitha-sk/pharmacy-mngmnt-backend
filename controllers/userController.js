import User from '../models/userModel.js';
import bcrypt from 'bcrypt';


const createUser = async (req, res) => {
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
            message: 'User Created successfully',
            user: { email: newUser.email, role: newUser.role }  // You can send additional user info if needed
        });
    } catch (error) {
        console.error("Error during UserCreation:", error);  // Log the full error
        res.status(500).json({ message: 'Server error', error: error.message || error });
    }
  };
  

  const getAllUsers = (req, res) => {
    User.find({}, { password: 0 }) // Exclude the password field
        .then((users) => {
            if (!users || users.length === 0) {
                return res.status(404).json({ message: "No users found." });
            }
            res.status(200).json(users); // Send the list of users
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
            res.status(500).json({ message: "Server error", error });
        });
};


const getUserById = (req, res) => {
    const { id } = req.params;

    User.findById(id, { password: 0 }) // Exclude the password field
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user); // Send the user data
        })
        .catch((error) => {
            console.error("Error fetching user:", error);
            res.status(500).json({ message: "Server error", error });
        });
}; 


const updateUser = (req, res) => {
    const { id } = req.params; // Extract user ID from the request parameters
    const { email, role } = req.body; // Extract email and role from the request body

    // Validate required fields
    if (!email || !role) {
        return res.status(400).json({ message: "Email and role are required." });
    }

    // Update user in the database
    User.findByIdAndUpdate(
        id,
        { email, role }, // Fields to update
        { new: true, runValidators: true } // Options: return updated doc and validate schema
    )
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json({
                message: "User updated successfully.",
                user: updatedUser,
            });
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to update user.", error });
        });
};


const deleteUser = (req, res) => {
    const { id } = req.params; // Extract the user ID from the URL parameters

    // Delete user by ID
    User.findByIdAndDelete(id)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json({
                message: "User deleted successfully.",
                user: deletedUser,
            });
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to delete user.", error });
        });
};

  export {createUser, getAllUsers, getUserById, updateUser, deleteUser};