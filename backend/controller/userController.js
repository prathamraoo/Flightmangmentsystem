import User from "../models/userSchema.js";


// CREATE USER (Admin)
export const createUser = async (req, res) => {
  try {

    const { useremail, username, userphone } = req.body;

    const addUser = await User.create({
      name: username,
      email: useremail,
      phone: userphone
    });

    res.status(200).json({
      success: true,
      message: "User added successfully",
      data: addUser
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error in adding user"
    });

  }
};



// GET ALL USERS (Admin)
export const getUser = async (req, res) => {

  try {

    const userData = await User.find();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: userData
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error in fetching users"
    });

  }

};



// SINGLE USER VIEW
export const singleView = async (req, res) => {

  try {

    const id = req.params.id;

    const userData = await User.findById(id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: userData
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error fetching user"
    });

  }

};



// DELETE USER (Admin)
export const deleteUser = async (req, res) => {

  try {

    const id = req.params.id;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error deleting user"
    });

  }

};



// UPDATE USER (Admin)
export const updateUser = async (req, res) => {

  try {

    const id = req.params.id;

    const data = req.body;

    const updateData = await User.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updateData
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error updating user"
    });

  }

};

// UPDATE USER ROLE (Admin)
export const updateUserRole = async (req, res) => {

  try {

    const id = req.params.id;
    const { role } = req.body;

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'"
      });
    }

    const updateData = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!updateData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: updateData
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error updating user role"
    });

  }

};