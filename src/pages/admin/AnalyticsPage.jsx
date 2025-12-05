"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/slices/userSlice";
import { getAllOrders } from "../../redux/slices/orderSlice";
import { getProducts } from "../../redux/slices/productSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import {
  FaUsers,
  FaShoppingCart,
  FaBox,
  FaMoneyBillWave,
  FaChartLine,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { adminOrders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllOrders());
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  if (usersLoading || ordersLoading || productsLoading || categoriesLoading) {
    return <Loader />;
  }

  // Calculate statistics
  const userCounts = {
    total: users.length,
    farmers: users.filter((u) => u.role === "farmer").length,
    consumers: users.filter((u) => u.role === "consumer").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  const orderStats = {
    total: adminOrders.length,
    pending: adminOrders.filter((o) => o.status === "pending").length,
    accepted: adminOrders.filter((o) => o.status === "accepted").length,
    completed: adminOrders.filter((o) => o.status === "completed").length,
    rejected: adminOrders.filter((o) => o.status === "rejected").length,
    cancelled: adminOrders.filter((o) => o.status === "cancelled").length,
  };

  const revenue = {
    total: adminOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    thisMonth: adminOrders
      .filter((o) => {
        if (o.status !== "completed") return false;
        const orderDate = new Date(o.createdAt || o.updatedAt);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  };

  // Category distribution
  const categoryDistribution = categories.map((cat) => ({
    name: cat.name,
    count: products.filter((p) => p.category === cat.name).length,
  }));

  // Top farmers by orders
  const farmerOrderCounts = {};
  adminOrders.forEach((order) => {
    const farmerId = order.farmer?._id || order.farmer;
    if (farmerId) {
      farmerOrderCounts[farmerId] = (farmerOrderCounts[farmerId] || 0) + 1;
    }
  });

  const topFarmers = Object.entries(farmerOrderCounts)
    .map(([farmerId, count]) => {
      const farmer = users.find((u) => u._id === farmerId);
      return { farmer, count };
    })
    .filter((item) => item.farmer)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Monthly revenue trend (last 6 months)
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthOrders = adminOrders.filter((o) => {
      if (o.status !== "completed") return false;
      const orderDate = new Date(o.createdAt || o.updatedAt);
      return (
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      );
    });
    monthlyRevenue.push({
      month: date.toLocaleString("default", { month: "short" }),
      revenue: monthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics & Reports</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
            <FaUsers className="text-blue-500 text-2xl" />
          </div>
          <p className="text-3xl font-bold">{userCounts.total}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-500">
              {userCounts.farmers} Farmers, {userCounts.consumers} Consumers
            </span>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
            <FaShoppingCart className="text-orange-500 text-2xl" />
          </div>
          <p className="text-3xl font-bold">{orderStats.total}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500">{orderStats.completed} Completed</span>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
            <FaBox className="text-purple-500 text-2xl" />
          </div>
          <p className="text-3xl font-bold">{products.length}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-500">{categories.length} Categories</span>
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
            <FaMoneyBillWave className="text-green-500 text-2xl" />
          </div>
          <p className="text-3xl font-bold">₨{revenue.total.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-500">₨{revenue.thisMonth.toFixed(2)} this month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Order Status Distribution */}
        <div className="glass p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FaChartPie className="mr-2 text-green-500" />
            Order Status Distribution
          </h2>
          <div className="space-y-4">
            {[
              { label: "Completed", value: orderStats.completed, color: "bg-green-500" },
              { label: "Pending", value: orderStats.pending, color: "bg-blue-500" },
              { label: "Accepted", value: orderStats.accepted, color: "bg-yellow-500" },
              { label: "Rejected", value: orderStats.rejected, color: "bg-red-500" },
              { label: "Cancelled", value: orderStats.cancelled, color: "bg-gray-500" },
            ].map((stat) => {
              const percentage =
                orderStats.total > 0 ? (stat.value / orderStats.total) * 100 : 0;
              return (
                <div key={stat.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <span className="text-sm text-gray-600">
                      {stat.value} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${stat.color} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FaChartPie className="mr-2 text-purple-500" />
            Products by Category
          </h2>
          <div className="space-y-4">
            {categoryDistribution
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((cat) => {
                const percentage = products.length > 0 ? (cat.count / products.length) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className="text-sm text-gray-600">
                        {cat.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="glass p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FaChartLine className="mr-2 text-green-500" />
          Monthly Revenue Trend (Last 6 Months)
        </h2>
        <div className="flex items-end justify-between h-64 space-x-2">
          {monthlyRevenue.map((month, index) => {
            const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
            const height = (month.revenue / maxRevenue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-600"
                    style={{ height: `${height}%` }}
                    title={`₨${month.revenue.toFixed(2)}`}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600">{month.month}</div>
                <div className="text-xs font-medium text-gray-800">
                  ₨{(month.revenue / 1000).toFixed(1)}k
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Farmers */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <GiFarmer className="mr-2 text-green-500" />
          Top Farmers by Orders
        </h2>
        {topFarmers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Rank
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Farmer
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Total Orders
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topFarmers.map((item, index) => (
                  <tr key={item.farmer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold">
                            {item.farmer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.farmer.name}</div>
                          <div className="text-sm text-gray-500">{item.farmer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-green-600">{item.count}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        {index === 0 && <FaArrowUp className="text-green-500 mr-1" />}
                        <span className="text-sm text-gray-600">Top Performer</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No farmer data available yet.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;




