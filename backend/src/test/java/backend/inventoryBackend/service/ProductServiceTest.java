package backend.inventoryBackend.service;

import backend.inventoryBackend.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService();
    }

    @Test
    void testAddProduct() {
        Product product = new Product(null, "Laptop", "Electronics", new BigDecimal("1200.00"), 5, "2025-12-31");
        Product addedProduct = productService.addProduct(product);

        assertNotNull(addedProduct.getId(), "Product ID should be assigned");
        assertEquals(1, productService.getAllProducts().size(), "Product should be added");
    }
    @Test
    void testGetProductById() {
        Product product = productService.addProduct(new Product(null, "Phone", "Electronics", new BigDecimal("800.00"), 3, "2024-06-15"));
        Optional<Product> foundProduct = productService.getProductById(product.getId());

        assertTrue(foundProduct.isPresent(), "Product should be found");
        assertEquals("Phone", foundProduct.get().getName(), "Product name should match");
    }

    @Test
    void testUpdateProduct() {
        Product product = productService.addProduct(new Product(null, "Tablet", "Electronics", new BigDecimal("500.00"), 7, "2024-08-20"));
        Product updatedProduct = new Product(null, "Tablet Pro", "Electronics", new BigDecimal("600.00"), 10, "2025-01-01");

        Product result = productService.updateProduct(product.getId(), updatedProduct);

        assertNotNull(result, "Updated product should not be null");
        assertEquals("Tablet Pro", result.getName(), "Product name should be updated");
        assertEquals(10, result.getQuantityStock(), "Stock should be updated");
    }

    @Test
    void testDeleteProduct() {
        Product product = productService.addProduct(new Product(null, "Smartwatch", "Wearables", new BigDecimal("300.00"), 2, "2024-12-10"));
        boolean deleted = productService.deleteProduct(product.getId());

        assertTrue(deleted, "Product should be deleted");
        assertTrue(productService.getAllProducts().isEmpty(), "Product list should be empty");
    }

    @Test
    void testMarkAsOutOfStock() {
        Product product = productService.addProduct(new Product(null, "Headphones", "Audio", new BigDecimal("100.00"), 5, "2025-07-15"));
        boolean marked = productService.markAsOutOfStock(product.getId());

        assertTrue(marked, "Product should be marked as out of stock");
        assertEquals(0, product.getQuantityStock(), "Stock should be set to 0");
    }

    @Test
    void testMarkAsInStock() {
        Product product = productService.addProduct(new Product(null, "Speaker", "Audio", new BigDecimal("250.00"), 0, "2025-09-01"));
        boolean marked = productService.markAsInStock(product.getId(), 15);

        assertTrue(marked, "Product should be marked as in stock");
        assertEquals(15, product.getQuantityStock(), "Stock should be updated to 15");
    }

    @Test
    void testStockMetrics() {
        productService.addProduct(new Product(null, "Item1", "CategoryA", new BigDecimal("10.00"), 5, "2025-10-10"));
        productService.addProduct(new Product(null, "Item2", "CategoryA", new BigDecimal("20.00"), 10, "2025-10-10"));

        var metrics = productService.getStockMetricsByCategory();

        assertTrue(metrics.containsKey("CategoryA"), "CategoryA should be in metrics");
        assertEquals(15, metrics.get("CategoryA").get("totalStock"), "Total stock should be 15");
    }
}