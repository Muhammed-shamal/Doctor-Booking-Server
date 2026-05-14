/**
 * Generic pagination helper for Mongoose
 * @param {Object} model - Mongoose model to query
 * @param {Object} options - Options for pagination and filtering
 *   options = {
 *     page: Number,
 *     limit: Number,
 *     search: String,
 *     searchFields: Array of field names,
 *     filters: Object, // e.g., { status: 'published', category: categoryId }
 *     populate: Array or Object (optional)
 *   }
 */
const getPaginatedResults = async (model, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  const search = options.search || "";
  const searchFields = options.searchFields || [];
  const select = options.select || "";
  const filters = options.filters || {};
  const populate = options.populate || [];

  // Build search query dynamically
  let searchQuery = {};
  if (search && searchFields.length > 0) {
    searchQuery = {
      $or: searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };
  }

  // Combine filters + search using $and
  // const query = { $and: [filters, searchQuery] };
  const query = {
    ...filters,
    ...(search && searchFields.length > 0
      ? {
          $or: searchFields.map((field) => ({
            [field]: { $regex: search, $options: "i" },
          })),
        }
      : {}),
  };

  const results = await model
    .find(query)
    .select(select)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate(populate);

  const totalCount = await model.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    results,
    totalPages,
    currentPage: page,
    totalCount,
  };
};

module.exports = getPaginatedResults;
