import { query } from "../../database/Connection";
import userQuery from "../../models/UsersQuery";

export const verifyGoogleToken = async (token: string) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) throw new Error("Failed to fetch Google user info");

    const payload = await response.json();

    return {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
    };
  } catch (error) {
    throw new Error("Invalid Google token");
  }
};

export const findOrCreateGoogleUser = async (googleData: any) => {
  try {
    const result = await query(
      "SELECT id, email, name, credit FROM users WHERE email = $1",
      [googleData.email],
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    const { query: sql, values } = userQuery.createOAuthUser(googleData);
    const newUser = await query(sql, values);

    return newUser.rows[0];
  } catch (error) {
    throw error;
  }
};
