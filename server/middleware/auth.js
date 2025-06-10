import jwt from 'jsonwebtoken';
export const auth = (req, res, next) => {
  try {
    const token = req.cookies.refreshtoken;  

    if (!token) {
      return res.status(403).json({ message: "Token Expired or Invalid Authentication." });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token Expired or Invalid Authentication." });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
