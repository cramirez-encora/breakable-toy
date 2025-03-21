package backend.inventoryBackend.Controllers;

import backend.inventoryBackend.model.Product;
import backend.inventoryBackend.service.ProductService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @InjectMocks
    private ProductController productController;

    @Mock
    private ProductService productService;

    @Captor
    private ArgumentCaptor<Product> productCaptor;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product(1L, "Shampoo", "Beauty",
                new BigDecimal("19.99"), 10, "2025-10-18");
    }

    @Test
    void testGetAllProducts() {
        when(productService.getAllProducts()).thenReturn(List.of(sampleProduct));
        List<Product> products = productController.getAllProducts(null, null, null);

        assertEquals(1, products.size());
        assertEquals("Shampoo", products.get(0).getName());
    }

    @Test
    void testGetProductById() {
        when(productService.getProductById(1L)).thenReturn(Optional.of(sampleProduct));
        ResponseEntity<Product> response = productController.getProductById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sampleProduct, response.getBody());
    }

    @Test
    void testGetProductById_NotFound() {
        when(productService.getProductById(1L)).thenReturn(Optional.empty());
        ResponseEntity<Product> response = productController.getProductById(1L);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testAddProduct() {
        when(productService.addProduct(any(Product.class))).thenReturn(sampleProduct);
        ResponseEntity<Product> response = productController.addProduct(sampleProduct);
        verify(productService).addProduct(productCaptor.capture());

        assertEquals("Shampoo", productCaptor.getValue().getName());
        assertEquals(sampleProduct, response.getBody());
    }

    @Test
    void testUpdateProduct() {
        when(productService.updateProduct(eq(1L), any(Product.class))).thenReturn(sampleProduct);
        Product updatedProduct = new Product(1L, "Shampoo", "Beauty",
                new BigDecimal("24.99"), 50, "2025-10-18");
        ResponseEntity<Product> response = productController.updateProduct(1L, updatedProduct);
        verify(productService).updateProduct(eq(1L), productCaptor.capture());

        assertEquals(new BigDecimal("24.99"), productCaptor.getValue().getUnitPrice());
        assertEquals(50, productCaptor.getValue().getQuantityStock());
        assertEquals(sampleProduct, response.getBody());
    }

    @Test
    void testDeleteProduct() {
        when(productService.getAllProducts()).thenReturn(List.of(sampleProduct));

        when(productService.deleteProduct(1L)).thenReturn(true);

        ResponseEntity<Void> response = productController.deleteProduct(1L);

        when(productService.getAllProducts()).thenReturn(List.of());

        verify(productService).deleteProduct(1L);

        assertEquals(204, response.getStatusCodeValue());
        List<Product> productsAfterDeletion = productController.getAllProducts(null, null, null);
        assertTrue(productsAfterDeletion.isEmpty(), "Product list should be empty after deletion");
    }

    @Test
    void testDeleteProduct_NotFound() {
        when(productService.deleteProduct(1L)).thenReturn(false);
        ResponseEntity<Void> response = productController.deleteProduct(1L);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testMarkAsOutOfStock() {
        when(productService.markAsOutOfStock(1L)).thenReturn(true);
        ResponseEntity<Void> response = productController.markAsOutOfStock(1L);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testMarkAsOutOfStock_NotFound() {
        when(productService.markAsOutOfStock(1L)).thenReturn(false);
        ResponseEntity<Void> response = productController.markAsOutOfStock(1L);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testMarkAsInStock() {
        when(productService.markAsInStock(1L, 10)).thenReturn(true);
        ResponseEntity<Void> response = productController.markAsInStock(1L, 10);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testMarkAsInStock_NotFound() {
        when(productService.markAsInStock(1L, 10)).thenReturn(false);
        ResponseEntity<Void> response = productController.markAsInStock(1L, 10);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testGetStockMetrics() {
        Map<String, Map<String, Object>> mockMetrics = Map.of("Beauty", Map.of("totalStock", 100));
        when(productService.getStockMetricsByCategory()).thenReturn(mockMetrics);
        Map<String, Map<String, Object>> response = productController.getStockMetrics();

        assertEquals(mockMetrics, response);
    }
}