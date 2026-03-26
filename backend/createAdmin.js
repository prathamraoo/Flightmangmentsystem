import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/userSchema.js";

const mongo_url = "mongodb://127.0.0.1:27017/airport";

// Connect to database
const createAdmin = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log("Database connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@skybook.com",
      phone: "1234567890",
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@skybook.com");
    console.log("🔑 Password: admin123");
    console.log("\n⚠️  Please change the password after first login!");

  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  }
};

createAdmin();