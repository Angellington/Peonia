const paginate = (model) => {
    return async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const offset = (page - 1) * limit;

            const { rows, count } = await model.findAndCountAll({
                limit,
                offset,
                order: [["id", "DESC"]]
            });

            const totalPages = Math.ceil(count / limit);
            
            res.paginated = {
                page,
                limit,
                total: count,
                totalPages,
                hasMore: page < totalPages,
                results: rows,
            }

            next();
        } catch (err) {
            console.error("Error in paginated middleware: ", err)
            return res.status(500).json({ error: "Error to paginated"})
        }
    }
}

module.exports = paginate