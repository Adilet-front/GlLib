/**
 * Страница "Мои бронирования"
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getMyReservations,
  takeReservedBook,
  returnBook,
  cancelReservation,
} from "../../entities/reservation/api/reservationApi";
import type { ReservationResponse } from "../../entities/reservation/model/types";
import "../../app/styles/reservations.css";

type FilterTab = "all" | "active" | "completed";

export const MyReservationsPage = () => {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("active");
  const [error, setError] = useState<string | null>(null);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getMyReservations();
      setReservations(data);
    } catch (err) {
      setError("Failed to load reservations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleTakeBook = async (id: number) => {
    try {
      await takeReservedBook(id);
      loadReservations();
    } catch (err) {
      alert("Failed to take book. Make sure the reservation period has started.");
      console.error(err);
    }
  };

  const handleReturnBook = async (id: number) => {
    try {
      await returnBook(id);
      loadReservations();
    } catch (err) {
      alert("Failed to return book");
      console.error(err);
    }
  };

  const handleCancelReservation = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      await cancelReservation(id);
      loadReservations();
    } catch (err) {
      alert("Failed to cancel reservation");
      console.error(err);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (filter === "active") {
      return r.status === "ACTIVE";
    } else if (filter === "completed") {
      return r.status === "COMPLETED" || r.status === "RETURNED";
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      ACTIVE: { class: "badge-success", label: "Active" },
      COMPLETED: { class: "badge-info", label: "Completed" },
      EXPIRED: { class: "badge-danger", label: "Expired" },
      CANCELLED: { class: "badge-default", label: "Cancelled" },
      RETURNED: { class: "badge-success", label: "Returned" },
    };
    return badges[status] || { class: "badge-default", label: status };
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="reservations-page">
      <div className="page-header">
        <h1>My Reservations</h1>
        <p>Manage your book reservations</p>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="empty-state">
          <p>No reservations found</p>
          <Link to="/catalog" className="btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="reservations-list">
          {filteredReservations.map((reservation) => {
            const badge = getStatusBadge(reservation.status);
            return (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-info">
                  <h3>
                    <Link to={`/book/${reservation.bookId}`}>
                      {reservation.bookTitle}
                    </Link>
                  </h3>
                  <div className="reservation-dates">
                    <div className="date-item">
                      <span className="date-label">Reserved:</span>
                      <span className="date-value">
                        {formatDate(reservation.reservedAt)}
                      </span>
                    </div>
                    {reservation.takenAt && (
                      <div className="date-item">
                        <span className="date-label">Taken:</span>
                        <span className="date-value">
                          {formatDate(reservation.takenAt)}
                        </span>
                      </div>
                    )}
                    {reservation.returnedAt && (
                      <div className="date-item">
                        <span className="date-label">Returned:</span>
                        <span className="date-value">
                          {formatDate(reservation.returnedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`badge ${badge.class}`}>{badge.label}</span>
                </div>

                <div className="reservation-actions">
                  {reservation.status === "ACTIVE" && !reservation.takenAt && (
                    <>
                      <button
                        className="btn-primary"
                        onClick={() => handleTakeBook(reservation.id)}
                      >
                        Take Book
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {reservation.status === "ACTIVE" && reservation.takenAt && !reservation.returnedAt && (
                    <button
                      className="btn-success"
                      onClick={() => handleReturnBook(reservation.id)}
                    >
                      Return Book
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;
