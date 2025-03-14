const loginquery = "SELECT * FROM users WHERE email = ? AND password = ?";
const signupquery = "INSERT INTO users (name, email,gender,dateOfBirth,password,image) VALUES (?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d', ?, ?)";
const newauthtokenquery = "INSERT INTO auth_token (email,token) VALUES (?, ?)";
const authtokenquery = 'SELECT * FROM auth_token WHERE email = ? AND token = ?';
const signupcheckquery = "SELECT * FROM users WHERE email = ?";
const deleteauthtokenquery = "DELETE FROM auth_token WHERE token = ?"; 