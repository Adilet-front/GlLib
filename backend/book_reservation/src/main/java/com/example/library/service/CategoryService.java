package com.example.library.service;

import com.example.library.entity.Category;
import com.example.library.repository.BookRepository;
import com.example.library.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    public Category create(String name, String description) {

        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category already exists");
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(description);

        return categoryRepository.save(category);
    }


    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category update(Long id, String newName, String newDescription) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getName().equals(newName) && categoryRepository.existsByName(newName)) {
            throw new RuntimeException("Category with this name already exists");
        }

        category.setName(newName);
        category.setDescription(newDescription);
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }

        if (bookRepository.existsByCategoryId(id)) {
            throw new RuntimeException("Cannot delete category: it is associated with books");
        }

        categoryRepository.deleteById(id);
    }
}
