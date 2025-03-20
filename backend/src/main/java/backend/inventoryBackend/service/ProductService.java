package backend.inventoryBackend.service;

import backend.inventoryBackend.model.Product;
import backend.inventoryBackend.model.CategoryMetricsDTO;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final List<Product> products = new ArrayList<>();
    private Long idCounter = 1L;

    public ProductService() {

    }

    public List<Product> getAllProducts() {
        return products;
    }

    public Optional<Product> getProductById(Long id) {
        return products.stream().filter(p -> p.getId().equals(id)).findFirst();
    }

    public Product addProduct(Product product) {
        product.setId(idCounter++);
        product.setUpdateDate();
        products.add(product);
        return product;
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Optional<Product> existingProductOpt = getProductById(id);
        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setCategory(updatedProduct.getCategory());
            existingProduct.setUnitPrice(updatedProduct.getUnitPrice());
            existingProduct.setQuantityStock(updatedProduct.getQuantityStock());
            existingProduct.setExpDate(updatedProduct.getExpDate());
            existingProduct.setUpdateDate();
            return existingProduct;
        }
        return null;
    }

    public boolean deleteProduct(Long id) {
        return products.removeIf(product -> product.getId().equals(id));
    }

    public boolean markAsOutOfStock(Long id) {
        Optional<Product> productOpt = getProductById(id);
        if (productOpt.isPresent()) {
            productOpt.get().setQuantityStock(0);
            return true;
        }
        return false;
    }

    public boolean markAsInStock(Long id, int quantity) {
        Optional<Product> productOpt = getProductById(id);
        if (productOpt.isPresent()) {
            productOpt.get().setQuantityStock(quantity);
            return true;
        }
        return false;
    }
    public Map<String, Map<String, Object>> getStockMetricsByCategory() {

        Map<String, Map<String, Object>> categoryMetrics = products.stream()
                .collect(Collectors.groupingBy(
                        Product::getCategory,
                        Collectors.collectingAndThen(Collectors.toList(), categoryProducts -> {
                            int totalStock = categoryProducts.stream().mapToInt(Product::getQuantityStock).sum();
                            BigDecimal totalValue = categoryProducts.stream()
                                    .map(p -> p.getUnitPrice().multiply(BigDecimal.valueOf(p.getQuantityStock())))
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                            BigDecimal averagePrice = totalStock == 0
                                    ? BigDecimal.ZERO
                                    : totalValue.divide(BigDecimal.valueOf(totalStock), 2, BigDecimal.ROUND_HALF_UP);

                            Map<String, Object> metrics = new HashMap<>();
                            metrics.put("totalStock", totalStock);
                            metrics.put("totalValue", totalValue);
                            metrics.put("averagePrice", averagePrice);
                            return metrics;
                        })
                ));

        int globalTotalStock = products.stream().mapToInt(Product::getQuantityStock).sum();
        BigDecimal globalTotalValue = products.stream()
                .map(p -> p.getUnitPrice().multiply(BigDecimal.valueOf(p.getQuantityStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal globalAveragePrice = globalTotalStock == 0
                ? BigDecimal.ZERO
                : globalTotalValue.divide(BigDecimal.valueOf(globalTotalStock), 2, BigDecimal.ROUND_HALF_UP);

        Map<String, Object> totalMetrics = new HashMap<>();
        totalMetrics.put("totalStock", globalTotalStock);
        totalMetrics.put("totalValue", globalTotalValue);
        totalMetrics.put("averagePrice", globalAveragePrice);

        categoryMetrics.put("TOTAL", totalMetrics);

        return categoryMetrics;
    }
}