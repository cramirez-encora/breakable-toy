package backend.inventoryBackend.Controllers;

import backend.inventoryBackend.model.Product;
import backend.inventoryBackend.service.ProductService;
import backend.inventoryBackend.model.CategoryMetricsDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:8080")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) String stock) {

        List<Product> products = productService.getAllProducts();

        // Filtering by name
        if (name != null) {
            products = products.stream()
                    .filter(p -> p.getName().toLowerCase().contains(name.toLowerCase()))
                    .toList();
        }

        // Filtering by category
        if (category != null && !category.isEmpty()) {
            products = products.stream()
                    .filter(p -> category.stream().anyMatch(c -> c.equalsIgnoreCase(p.getCategory())))
                    .toList();
        }

        // Filtering by stock
        if (stock != null) {
            if (stock.equalsIgnoreCase("In Stock")) {
                products = products.stream().filter(p -> p.getQuantityStock() > 0).toList();
            } else if (stock.equalsIgnoreCase("Out of Stock")) {
                products = products.stream().filter(p -> p.getQuantityStock() == 0).toList();
            }
        }

        return products;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product createdProduct = productService.addProduct(product);
        return ResponseEntity.ok(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product updated = productService.updateProduct(id, updatedProduct);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProduct(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/outofstock")
    public ResponseEntity<Void> markAsOutOfStock(@PathVariable Long id) {
        boolean updated = productService.markAsOutOfStock(id);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/instock")
    public ResponseEntity<Void> markAsInStock(@PathVariable Long id, @RequestParam int quantity) {
        boolean updated = productService.markAsInStock(id, quantity);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
    @GetMapping("/metrics")
    public Map<String, Map<String, Object>> getStockMetrics() {
        return productService.getStockMetricsByCategory();
    }
}