const userQuery = {
  createGoogleUser: (userData: any) => ({
    query: `INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name, created_at`,
    values: [userData.email, userData.name, null],
  }),
  create: (userData: any) => ({
    query: `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email, name, created_at`,
    values: [userData.name, userData.email, userData.password],
  }),
  login: (email: string) => ({
    query: `SELECT * FROM users WHERE email = $1`,
    values: [email],
  }),
};

export default userQuery;
