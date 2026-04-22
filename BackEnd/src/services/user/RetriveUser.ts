import { query } from "../../database/Connection";
import userQuery from "../../models/UsersQuery";

export const retrieveUser = async (userId: number) => {
  try {
    const { query: sql, values } = userQuery.retrieve(userId);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "User Retrieval Unsuccessful!" };
    }
    return {
      success: true,
      message: "User Retrieved!",
      user: result.rows[0],
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
