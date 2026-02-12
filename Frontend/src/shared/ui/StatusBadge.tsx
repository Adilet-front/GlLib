/**
 * Бейдж статуса книги: доступна / забронирована / на руках.
 * Стили: .status, .status--available, .status--reserved, .status--borrowed.
 */
type StatusBadgeProps = {
  status: "available" | "reserved" | "borrowed";
};

const statusLabel: Record<StatusBadgeProps["status"], string> = {
  available: "Доступна",
  reserved: "Забронирована",
  borrowed: "На руках",
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`status status--${status}`}>{statusLabel[status]}</span>
);
