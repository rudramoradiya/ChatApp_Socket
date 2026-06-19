const User = require("../../models/user");

module.exports = async (req, res) => {
  try {
    const {
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filter by status (online/offline)
    if (status) {
      const statusArray = Array.isArray(status)
        ? status
        : status.split(",").map((s) => s.trim());
      query.status = { $in: statusArray };
    }

    // Search filter
    if (search) {
      const regex = new RegExp(search, "i");
      const numberSearch = Number(search);
      const isNumber = !isNaN(numberSearch);

      query.$or = [
        { username: { $regex: regex } },
        { email: { $regex: regex } },
        { phone: { $regex: regex } },
      ];

      if (isNumber) {
        query.$or.push({ phone: numberSearch });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    return res.success({
      message: "Users fetched successfully",
      data: users,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.internalServerError({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
