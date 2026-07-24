class ApiResponse {
  static success(res, message, data = null, statusCode = 200) {
    const response = { success: true, message };
    if (data !== null) response.data = data;
    return res.status(statusCode).json(response);
  }

  static created(res, message, data = null) {
    return this.success(res, message, data, 201);
  }

  static error(res, message, statusCode = 500, errors = null) {
    const response = { success: false, message };
    if (errors !== null) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  static unauthorized(res, message = "Unauthorized access") {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = "Forbidden - Insufficient permissions") {
    return this.error(res, message, 403);
  }

  static badRequest(res, message = "Bad request", errors = null) {
    return this.error(res, message, 400, errors);
  }

  static paginated(res, message, data, pagination) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalItems: pagination.total,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPrevPage: pagination.page > 1,
      },
    });
  }
}

module.exports = ApiResponse;