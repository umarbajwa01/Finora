const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Transaction = require("../models/Transaction");
const { advanceDate } = require("../services/recurring.service");

// GET /api/transactions
const getTransactions = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    type,
    category,
    search,
    sort,
    startDate,
    endDate,
    minAmount,
    maxAmount,
  } = req.query;

  const filter = { userId: req.userId };
  if (type && type !== "all") filter.type = type;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { note: { $regex: search, $options: "i" } },
    ];
  }
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = startDate;
    if (endDate) filter.date.$lte = endDate;
  }
  if (minAmount !== undefined || maxAmount !== undefined) {
    filter.amount = {};
    if (minAmount !== undefined) filter.amount.$gte = minAmount;
    if (maxAmount !== undefined) filter.amount.$lte = maxAmount;
  }

  const sortMap = {
    newest: { date: -1 },
    oldest: { date: 1 },
    highest: { amount: -1 },
    lowest: { amount: 1 },
  };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Transaction.find(filter).sort(sortMap[sort]).skip(skip).limit(limit),
    Transaction.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse(200, {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + items.length < total,
      },
    })
  );
});

// GET /api/transactions/:id
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.userId });
  if (!transaction) throw new ApiError(404, "Transaction not found.");
  res.json(new ApiResponse(200, transaction));
});

// POST /api/transactions
const createTransaction = asyncHandler(async (req, res) => {
  const payload = { ...req.body, userId: req.userId };

  if (payload.isRecurring && payload.recurring?.frequency) {
    payload.recurring.nextRunDate = advanceDate(
      payload.date || new Date(),
      payload.recurring.frequency
    );
    payload.recurring.active = true;
  }

  const transaction = await Transaction.create(payload);
  res.status(201).json(new ApiResponse(201, transaction, "Transaction added."));
});

// PUT /api/transactions/:id
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!transaction) throw new ApiError(404, "Transaction not found.");
  res.json(new ApiResponse(200, transaction, "Transaction updated."));
});

// DELETE /api/transactions/:id
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });
  if (!transaction) throw new ApiError(404, "Transaction not found.");
  res.json(new ApiResponse(200, null, "Transaction deleted."));
});

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
