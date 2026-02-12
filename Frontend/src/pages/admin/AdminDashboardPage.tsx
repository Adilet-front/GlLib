/**
 * Главная страница админ панели (Dashboard)
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllUsers, getAllCategories } from "../../entities/admin/api/adminApi";
import { getBooks } from "../../entities/book/api/bookApi";
import "../../app/styles/admin.css";

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalBooks: 0,
    availableBooks: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [allUsers, pendingUsers, books, categories] = await Promise.all([
          getAllUsers(),
          getAllUsers(false),
          getBooks(),
          getAllCategories(),
        ]);

        const availableBooks = books.filter(
          (b: any) => b.status === "AVAILABLE"
        ).length;

        setStats({
          totalUsers: allUsers.data.length,
          pendingUsers: pendingUsers.data.length,
          totalBooks: books.length,
          availableBooks,
          totalCategories: categories.data.length,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's your library overview</p>
      </div>

      <div className="stats-grid">
        <Link to="/admin/users" className="stat-card stat-users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
            {stats.pendingUsers > 0 && (
              <div className="stat-badge">{stats.pendingUsers} pending</div>
            )}
          </div>
        </Link>

        <Link to="/admin/books" className="stat-card stat-books">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalBooks}</div>
            <div className="stat-label">Total Books</div>
            <div className="stat-badge">{stats.availableBooks} available</div>
          </div>
        </Link>

        <Link to="/admin/categories" className="stat-card stat-categories">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalCategories}</div>
            <div className="stat-label">Categories</div>
          </div>
        </Link>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/books" className="action-card">
            <span className="action-icon">➕</span>
            <span className="action-text">Add New Book</span>
          </Link>
          <Link to="/admin/categories" className="action-card">
            <span className="action-icon">🏷️</span>
            <span className="action-text">Create Category</span>
          </Link>
          <Link to="/admin/users" className="action-card">
            <span className="action-icon">✅</span>
            <span className="action-text">
              Approve Users {stats.pendingUsers > 0 && `(${stats.pendingUsers})`}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
