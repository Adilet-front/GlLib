package com.example.library.Specification;

import com.example.library.enam.BookStatus;
import com.example.library.entity.Book;
import io.minio.messages.Tag;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class BookSpecification {

    public static Specification<Book> tags(List<String> tags) {
        return (root, query, cb) -> {
            if (tags == null || tags.isEmpty()) {
                return cb.conjunction();
            }

            query.distinct(true);

            Join<Book, Tag> tagJoin = root.join("tags");

            return tagJoin.get("name").in(tags);
        };
    }

    public static Specification<Book> search(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + search.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("author")), pattern)
            );
        };
    }

    public static Specification<Book> status(BookStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<Book> category(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("category").get("id"), categoryId);
        };
    }

    public static Specification<Book> author(String author) {
        return (root, query, cb) -> {
            if (author == null || author.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("author")),
                    "%" + author.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Book> location(String location) {
        return (root, query, cb) -> {
            if (location == null || location.isBlank()) {
                return cb.conjunction();
            }
            return cb.equal(root.get("location"), location);
        };
    }

    public static Specification<Book> minRating(Double rating) {
        return (root, query, cb) -> {
            if (rating == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("rating"), rating);
        };
    }
}