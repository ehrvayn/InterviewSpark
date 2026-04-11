import { query } from "../../database/Connection";
import userQuery from "../../models/UsersQuery";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const Login = async (email: string, password: string) => {
  try {
    const { query: userSql, values: userValues } = userQuery.login(email);
    const result = await query(userSql, userValues);

    if (result.rowCount != 0) {
      const user = result.rows[0];
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return { success: false, message: "Password is incorrect! Please try again." };
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" },
      );

      return { success: true, message: "You have successfully signed in.", token };
    }

    return { success: false, message: "Email address doesn't exist!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "An unexpected error occurred. Please try again later." };
  }
};

export default Login;