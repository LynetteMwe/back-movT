module.exports = (req, res, next) => {
    res.status(401).json({
        status: res.statusCode,
        message: `Method ${req.method} not allowed!`,
    });
};
