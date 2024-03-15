const filterLandingPageEvents = async (req, res, next) => {
    req.query["host"] = 'technoob'
    next();
};

module.exports = {
    filterLandingPageEvents,
};