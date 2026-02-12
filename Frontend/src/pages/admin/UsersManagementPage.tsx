/**
 * Страница управления пользователями (Admin)
 */
import { useState, useEffect } from "react";
import { getAllUsers, approveUser } from "../../entities/admin/api/adminApi";
import type { UserResponse } from "../../entities/user/model/types";
import "../../app/styles/admin.css";

type FilterTab = "all" | "pending" | "approved";

export const UsersManagementPage = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async (enabled?: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getAllUsers(enabled);
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter === "all") {
      loadUsers();
    } else if (filter === "pending") {
      loadUsers(false);
    } else {
      loadUsers(true);
    }
  }, [filter]);

  const handleApprove = async (userId: number) => {
    try {
      await approveUser(userId);
      // Перезагрузить список
      loadUsers(filter === "all" ? undefined : filter === "approved");
    } catch (err) {
      alert("Failed to approve user");
      console.error(err);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "badge-admin",
      USER: "badge-user",
    };
    return colors[role] || "badge-default";
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Users Management</h1>
        <p>Manage user accounts and permissions</p>
      </div>

      <div className="admin-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Users
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending Approval
        </button>
        <button
          className={`filter-btn ${filter === "approved" ? "active" : ""}`}
          onClick={() => setFilter("approved")}
        >
          Approved
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${user.enabled ? "badge-success" : "badge-warning"}`}
                    >
                      {user.enabled ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td>
                    {!user.enabled && (
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(user.id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="empty-state">
              <p>No users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersManagementPage;
