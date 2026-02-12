/**
 * Кнопка для бронирования книги
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reserveBook } from "../../../entities/reservation/api/reservationApi";
import { useAuth } from "../../auth/model/useAuth";

interface ReserveButtonProps {
  bookId: number;
  bookTitle: string;
  isAvailable: boolean;
  onReserved?: () => void;
}

export const ReserveButton = ({
  bookId,
  bookTitle,
  isAvailable,
  onReserved,
}: ReserveButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: { pathname: `/book/${bookId}` } } });
      return;
    }

    if (!isAvailable) {
      alert("This book is not available for reservation");
      return;
    }

    try {
      setLoading(true);
      await reserveBook(bookId);
      alert(`"${bookTitle}" has been reserved successfully!`);
      onReserved?.();
      navigate("/reservations");
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err?.response?.data?.error;

      if (status === 409) {
        alert("You already have an active reservation for this book");
      } else if (status === 400) {
        alert(message || "This book is not available for reservation");
      } else {
        alert("Failed to reserve book. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAvailable) {
    return (
      <button className="btn-reserve disabled" disabled>
        Not Available
      </button>
    );
  }

  return (
    <button
      className="btn-reserve"
      onClick={handleReserve}
      disabled={loading}
    >
      {loading ? "Reserving..." : "Reserve Book"}
    </button>
  );
};
