import { query } from "../../database/Connection";
import userQuery from "../../models/UsersQuery";
import bcrypt from "bcrypt"

const RegisterUser = async (userData: any) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const secureData = { ...userData, password: hashedPassword };

    const { query: sql, values } = userQuery.create(secureData);
    const result = await query(sql, values);

    const { password, ...userWithoutPassword } = result.rows[0];

    return {
      success: true,
      message: "User registered successfully!",
      data: userWithoutPassword,
    };
  } catch (err: any) {
    console.error(err);
    if (err.code === "23505")
      return { success: false, message: "Email already taken" };
    return { success: false, message: "Registration failed" };
  }
};
export default RegisterUser;
