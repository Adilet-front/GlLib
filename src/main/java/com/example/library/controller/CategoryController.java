package com.example.library.controller;

import com.example.library.Dto.BookFilterRequest;
import com.example.library.Dto.BookResponse;
import com.example.library.Dto.CategoryRequest;
import com.example.library.entity.Category;
import com.example.library.service.BookService;
import com.example.library.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final BookService bookService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Category create(@RequestBody CategoryRequest request) {
        return categoryService.create(
                request.name(),
                request.description()
        );
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @PostMapping("/books/search") // Тестовый и временный энпоинт фильтрации
    public List<BookResponse> search(@RequestBody BookFilterRequest filter) {
        return bookService.search(filter);
    }
}
