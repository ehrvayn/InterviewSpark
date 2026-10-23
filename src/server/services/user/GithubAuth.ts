import axios from "axios";
import { query } from "../../database/Connection";
import userQuery from "../../models/UsersQuery";

export const verifyGithubToken = async (code: string) => {
  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );
    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) throw new Error("Failed to get GitHub access token");

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
      },
    });

    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
        },
      },
    );

    const primaryEmail = emailResponse.data.find((e: any) => e.primary)?.email;

    if (!primaryEmail)
      throw new Error("No primary email found on GitHub account");

    return {
      email: primaryEmail,
      name: userResponse.data.name || userResponse.data.login,
      githubId: userResponse.data.id,
    };
  } catch (error) {
    throw new Error("Invalid GitHub token");
  }
};

export const findOrCreateGithubUser = async (githubData: any) => {
  try {
    const result = await query(
      "SELECT id, email, name, credit FROM users WHERE email = $1",
      [githubData.email],
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    const { query: sql, values } = userQuery.createOAuthUser(githubData);
    const newUser = await query(sql, values);

    return newUser.rows[0];
  } catch (error) {
    throw error;
  }
};
