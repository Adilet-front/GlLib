/**
 * Страница просроченных бронирований (Admin)
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOverdueReservations } from "../../entities/reservation/api/reservationApi";
import type { ReservationResponse } from "../../entities/reservation/model/types";
import "../../app/styles/admin.css";

export const OverdueReservationsPage = () => {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverdueReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getOverdueReservations();
      setReservations(data);
    } catch (err) {
      setError("Failed to load overdue reservations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverdueReservations();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysOverdue = (takenAt?: string) => {
    if (!takenAt) return 0;
    const taken = new Date(takenAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - taken.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Предполагаем что срок выдачи - 14 дней
    return Math.max(0, diffDays - 14);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Overdue Books</h1>
        <p>Books that have not been returned on time</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p>No overdue reservations</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Book Title</th>
                <th>Reservation ID</th>
                <th>Reserved At</th>
                <th>Taken At</th>
                <th>Days Overdue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => {
                const daysOverdue = getDaysOverdue(reservation.takenAt);
                return (
                  <tr key={reservation.id}>
                    <td>{reservation.bookId}</td>
                    <td>
                      <Link to={`/book/${reservation.bookId}`}>
                        {reservation.bookTitle}
                      </Link>
                    </td>
                    <td>#{reservation.id}</td>
                    <td>{formatDate(reservation.reservedAt)}</td>
                    <td>{formatDate(reservation.takenAt)}</td>
                    <td>
                      <span className="badge badge-danger">
                        {daysOverdue} days
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-warning">
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OverdueReservationsPage;
