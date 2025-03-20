package backend.inventoryBackend.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {
    private final List<String> categories = new ArrayList<>();

    public List<String> getAllCategories() {
        return new ArrayList<>(categories);
    }

    public boolean addCategory(String category) {
        if (!categories.contains(category)) {
            categories.add(category);
            return true;
        }
        return false;
    }
}