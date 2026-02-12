/**
 * Страница управления книгами (Admin)
 */
import { useState, useEffect } from "react";
import {
  createBook,
  deleteBook,
  softDeleteBook,
  uploadBookCover,
  getAllCategories,
  type BookCreateRequest,
  type BookResponse,
  type Category,
} from "../../entities/admin/api/adminApi";
import { getBooks } from "../../entities/book/api/bookApi";
import "../../app/styles/admin.css";

export const BooksManagementPage = () => {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<BookCreateRequest>({
    title: "",
    author: "",
    description: "",
    categoryId: 0,
    location: "",
  });
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [books, categoriesRes] = await Promise.all([
        getBooks(),
        getAllCategories(),
      ]);
      // Преобразуем Book[] в BookResponse[]
      const booksData: BookResponse[] = books.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author || "",
        description: book.description,
        category: book.category || "",
        location: book.location || "",
        coverUrl: book.coverUrl,
        status: book.status || "AVAILABLE",
      }));
      setBooks(booksData);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Please select a category");
      return;
    }

    try {
      const { data: newBook } = await createBook(formData);

      // Если есть обложка, загружаем её
      if (selectedCover) {
        await uploadBookCover(newBook.id, selectedCover);
      }

      setShowModal(false);
      setFormData({
        title: "",
        author: "",
        description: "",
        categoryId: 0,
        location: "",
      });
      setSelectedCover(null);
      loadData();
    } catch (err) {
      alert("Failed to create book");
      console.error(err);
    }
  };

  const handleDelete = async (bookId: number, hard: boolean = false) => {
    if (!confirm(`Are you sure you want to ${hard ? "delete" : "archive"} this book?`)) {
      return;
    }

    try {
      if (hard) {
        await deleteBook(bookId);
      } else {
        await softDeleteBook(bookId);
      }
      loadData();
    } catch (err) {
      alert("Failed to delete book");
      console.error(err);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedCover(e.target.files[0]);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: "badge-success",
      RESERVED: "badge-warning",
      TAKEN: "badge-info",
      RETURNED: "badge-default",
    };
    return colors[status] || "badge-default";
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Books Management</h1>
          <p>Create, edit, and manage library books</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add New Book
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} />
                ) : (
                  <div className="book-cover-placeholder">No Cover</div>
                )}
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-category">{book.category}</p>
                <p className="book-location">📍 {book.location}</p>
                <span className={`badge ${getStatusBadge(book.status)}`}>
                  {book.status}
                </span>
              </div>
              <div className="book-actions">
                <button
                  className="btn-archive"
                  onClick={() => handleDelete(book.id, false)}
                >
                  Archive
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(book.id, true)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {books.length === 0 && !loading && (
        <div className="empty-state">
          <p>No books found</p>
        </div>
      )}

      {/* Modal для создания книги */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Book</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Author *</label>
                <input
                  id="author"
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryId">Category *</label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value="0">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Shelf A, Row 3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cover">Book Cover</label>
                <input
                  id="cover"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleCoverChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksManagementPage;
