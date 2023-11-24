const TrafficMetric = require('../models/trafficMetrics');


module.exports = {

  async getDailyTrafficForWeek() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);

    const result = await TrafficMetric.aggregate([
        {
            $match: {
                createdAt: { $gte: oneWeekAgo, $lt: now }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                count: 1
            }
        },
        {
            $sort: { date: 1 }
        },
        {
            $group: {
                _id: null,
                days: { $push: '$$ROOT' },
                totalCount: { $sum: '$count' }
            }
        },
        {
            $project: {
                _id: 0,
                days: 1,
                totalCount: 1
            }
        }
    ]);

    return result[0]; 
  },
  async getTrafficForLastNMonths(n) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() + 1 - n, 2, 0, 0, 0, 0);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const result = await TrafficMetric.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                count: 1
            }
        },
        {
            $sort: { year: 1, month: 1 }
        },
        {
            $group: {
                _id: null,
                months: { $push: '$$ROOT' },
                totalCount: { $sum: '$count' }
            }
        },
        {
            $project: {
                _id: 0,
                months: 1,
                totalCount: 1
            }
        }
    ]);

    if (result.length > 0) {
        return result[0];
    } else {
        return { months: [], totalCount: 0 };
    }
  },
  

  async getMetricsLastThreeMonths() {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
      const result = await TrafficMetric.aggregate([
          {
              $match: {
                  createdAt: { $gte: startDate, $lte: endDate }
              }
          },
          {
              $group: {
                  _id: { $month: '$createdAt' },
                  count: { $sum: 1 }
              }
          },
          {
              $project: {
                  _id: 0,
                  month: '$_id',
                  count: 1
              }
          },
          {
              $sort: { month: 1 }
          },
          {
              $group: {
                  _id: null,
                  months: { $push: '$$ROOT' },
                  totalCount: { $sum: '$count' }
              }
          },
          {
              $project: {
                  _id: 0,
                  months: 1,
                  totalCount: 1
              }
          }
      ]);
  
      return result[0]; 
  },
  
  async getMetricsLastDays(days) {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - Number.parseInt(days));
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
      const result = await TrafficMetric.aggregate([
          {
              $match: {
                  createdAt: { $gte: startDate, $lte: endDate }
              }
          },
          {
              $group: {
                  _id: {
                      day: { $dayOfMonth: '$createdAt' },
                      month: { $month: '$createdAt' },
                      year: { $year: '$createdAt' },
                      endpoint: '$endpoint',
                      method: '$method'
                  },
                  count: { $sum: 1 }
              }
          },
          {
              $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, count: -1 }
          },
          {
              $group: {
                  _id: { day: '$_id.day', month: '$_id.month', year: '$_id.year' },
                  count: { $first: '$count' },
                  mostVisitedEndpoint: { $first: '$_id.endpoint' },
                  mostUsedMethod: { $first: '$_id.method' }
              }
          },
          {
              $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
          },
          {
              $project: {
                  _id: 0,
                  day: '$_id.day',
                  month: '$_id.month',
                  year: '$_id.year',
                  count: 1,
                  mostVisitedEndpoint: 1,
                  mostUsedMethod: 1
              }
          },
          {
              $group: {
                  _id: null,
                  days: { $push: '$$ROOT' },
                  totalCount: { $sum: '$count' }
              }
          },
          {
              $project: {
                  _id: 0,
                  days: 1,
                  totalCount: 1
              }
          }
      ]);
  
      return result[0]; 
  },
    
  async getMetricsLastSevenDays() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const result = await TrafficMetric.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    dayOfWeek: { $dayOfWeek: '$createdAt' },
                    endpoint: '$endpoint',
                    method: '$method'
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.dayOfWeek': 1, count: -1 }
        },
        {
            $group: {
                _id: '$_id.dayOfWeek',
                count: { $first: '$count' },
                mostVisitedEndpoint: { $first: '$_id.endpoint' },
                mostUsedMethod: { $first: '$_id.method' }
            }
        },
        {
            $sort: { _id: 1 }
        },
        {
            $project: {
                _id: 0,
                dayOfWeek: '$_id',
                count: 1,
                mostVisitedEndpoint: 1,
                mostUsedMethod: 1
            }
        },
        {
            $group: {
                _id: null,
                days: { $push: '$$ROOT' },
                totalCount: { $sum: '$count' }
            }
        },
        {
            $project: {
                _id: 0,
                days: 1,
                totalCount: 1
            }
        }
    ]);

    return result[0]; 
  },
  
async getMonthlyTrafficForYear(year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  const result = await TrafficMetric.aggregate([
      {
          $match: {
              createdAt: { $gte: startDate, $lt: endDate }
          }
      },
      {
          $group: {
              _id: {
                  month: { $month: '$createdAt' },
                  endpoint: '$endpoint',
                  method: '$method'
              },
              count: { $sum: 1 }
          }
      },
      {
          $sort: { '_id.month': 1, count: -1 }
      },
      {
          $group: {
              _id: '$_id.month',
              count: { $first: '$count' },
              mostVisitedEndpoint: { $first: '$_id.endpoint' },
              mostUsedMethod: { $first: '$_id.method' }
          }
      },
      {
          $sort: { _id: 1 }
      },
      {
          $project: {
              _id: 0,
              month: '$_id',
              count: 1,
              mostVisitedEndpoint: 1,
              mostUsedMethod: 1
          }
      },
      {
          $group: {
              _id: null,
              months: { $push: '$$ROOT' },
              totalCount: { $sum: '$count' }
          }
      },
      {
          $project: {
              _id: 0,
              months: 1,
              totalCount: 1
          }
      }
  ]);

  return result[0];
  },
    
  async getDailyTraffic() {
    const now = new Date();
    const oneDayAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    const result = await TrafficMetric.aggregate([
        {
            $match: {
                createdAt: { $gte: oneDayAgo, $lt: now }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: '$createdAt' },
                    endpoint: '$endpoint',
                    method: '$method'
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.day': 1, count: -1 }
        },
        {
            $group: {
                _id: '$_id.day',
                count: { $first: '$count' },
                mostVisitedEndpoint: { $first: '$_id.endpoint' },
                mostUsedMethod: { $first: '$_id.method' }
            }
        },
        {
            $sort: { _id: 1 }
        },
        {
            $project: {
                _id: 0,
                day: '$_id',
                count: 1,
                mostVisitedEndpoint: 1,
                mostUsedMethod: 1
            }
        }
    ]);

    return result;
  },
  
    
  async getDailyTrafficForMonth(month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await TrafficMetric.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: '$createdAt' },
                    endpoint: '$endpoint',
                    method: '$method'
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.day': 1, count: -1 }
        },
        {
            $group: {
                _id: '$_id.day',
                count: { $first: '$count' },
                mostVisitedEndpoint: { $first: '$_id.endpoint' },
                mostUsedMethod: { $first: '$_id.method' }
            }
        },
        {
            $sort: { _id: 1 }
        },
        {
            $project: {
                _id: 0,
                day: '$_id',
                count: 1,
                mostVisitedEndpoint: 1,
                mostUsedMethod: 1
            }
        },
        {
            $group: {
                _id: null,
                days: { $push: '$$ROOT' },
                totalCount: { $sum: '$count' }
            }
        },
        {
            $project: {
                _id: 0,
                days: 1,
                totalCount: 1
            }
        }
    ]);

    if (result.length > 0) {
        return result[0];
    } else {
        return { days: [], totalCount: 0 };
    }
},
  
  async getTotalTrafficByYear(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const result = await TrafficMetric.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    method: '$method',
                    endpoint: '$endpoint'
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                method: '$_id.method',
                endpoint: '$_id.endpoint',
                count: 1
            }
        },
        {
            $group: {
                _id: null,
                endpoints: { $push: '$$ROOT' },
                totalCount: { $sum: '$count' }
            }
        },
        {
            $project: {
                _id: 0,
                endpoints: 1,
                totalCount: 1
            }
        }
    ]);

    return result[0]; 
  },
      
  async getOverallTotalTraffic() {
    const result = await TrafficMetric.aggregate([
        {
            $group: {
                _id: {
                    method: '$method',
                    endpoint: '$endpoint'
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                method: '$_id.method',
                endpoint: '$_id.endpoint',
                count: 1
            }
        },
        {
            $group: {
                _id: null,
                endpoints: { $push: '$$ROOT' },
                totalCount: { $sum: '$count' }
            }
        },
        {
            $project: {
                _id: 0,
                endpoints: 1,
                totalCount: 1
            }
        }
    ]);

    return result[0]; 
  },
  

}
