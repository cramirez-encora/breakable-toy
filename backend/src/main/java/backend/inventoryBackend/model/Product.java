package backend.inventoryBackend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class Product {
    private Long id;
    private String name;
    private String category;
    private BigDecimal unitPrice;
    private int quantityStock;
    private String expDate;
    private LocalDateTime creationDate;
    private LocalDateTime updateDate;


    public Product(Long id, String name, String category, BigDecimal unitPrice,
                   int quantityStock, String expDate) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.unitPrice = unitPrice;
        this.quantityStock = quantityStock;
        this.expDate = expDate;
        this.creationDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }


    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public int getQuantityStock() { return quantityStock; }
    public String getExpDate() { return expDate; }
    public LocalDateTime getCreationDate() { return creationDate; }
    public LocalDateTime getUpdateDate() { return updateDate; }


    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCategory(String category) { this.category = category; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public void setQuantityStock(int quantityStock) { this.quantityStock = quantityStock; }
    public void setExpDate(String expDate) { this.expDate = expDate; }
    public void setUpdateDate() {
        this.updateDate = LocalDateTime.now();
    }
}