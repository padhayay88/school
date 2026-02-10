// SIMPLE MODE: No database - returns mock data

const getSummary = async (req, res, next) => {
  try {
    // Mock data for testing
    res.json({
      students: 150,
      teachers: 12,
      totalFeesCollected: 450000,
      totalPendingFees: 75000,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyFeeCollection = async (req, res, next) => {
  try {
    // Mock monthly data
    const monthlyData = [
      { _id: 1, total: 35000 },
      { _id: 2, total: 42000 },
      { _id: 3, total: 38000 },
      { _id: 4, total: 45000 },
      { _id: 5, total: 50000 },
      { _id: 6, total: 40000 },
    ];
    res.json(monthlyData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getMonthlyFeeCollection,
};
