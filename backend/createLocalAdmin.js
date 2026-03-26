import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/userSchema.js";

// Use local MongoDB
const mongo_url = "mongodb://localhost:27017/skybook";

const createAdmin = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log("Connected to local MongoDB database");

    // Delete existing admin if any
    await User.deleteMany({ role: "admin" });
    console.log("Deleted existing admin users");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@skybook.com",
      phone: "1234567890",
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin user created successfully in local MongoDB!");
    console.log("📧 Email: admin@skybook.com");
    console.log("🔑 Password: admin123");
    console.log("🆔 ID:", adminUser._id);

    // Verify creation
    const verifyAdmin = await User.findOne({ email: "admin@skybook.com" });
    console.log("✅ Verification - Admin found:", verifyAdmin ? "YES" : "NO");

    // Show all users
    const allUsers = await User.find({});
    console.log("📊 Total users in database:", allUsers.length);
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();
