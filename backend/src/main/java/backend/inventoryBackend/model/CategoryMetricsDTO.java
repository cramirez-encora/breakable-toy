package backend.inventoryBackend.model;

import java.math.BigDecimal;

public class CategoryMetricsDTO {
    private String category;
    private int totalProductsInStock;
    private BigDecimal totalValueInStock;
    private BigDecimal averagePriceInStock;

    public CategoryMetricsDTO(String category, int totalProductsInStock, BigDecimal totalValueInStock, BigDecimal averagePriceInStock) {
        this.category = category;
        this.totalProductsInStock = totalProductsInStock;
        this.totalValueInStock = totalValueInStock;
        this.averagePriceInStock = averagePriceInStock;
    }

    public String getCategory() { return category; }
    public int getTotalProductsInStock() { return totalProductsInStock; }
    public BigDecimal getTotalValueInStock() { return totalValueInStock; }
    public BigDecimal getAveragePriceInStock() { return averagePriceInStock; }
}