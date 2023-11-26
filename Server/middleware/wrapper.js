const executeController = async (controller, req, res, next) => {
    try {
        await controller(req, res);
        next();
    } catch (error) {
        next(error)
    }
};

module.exports = {
    executeController,
};