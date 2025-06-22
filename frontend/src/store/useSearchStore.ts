import { create } from 'zustand';
import type { Product } from '../types/Product';


interface SearchFilters {
    searchTerm: string;
    categories: string[];
    stock: string[];
}
interface SearchState{
    filters: SearchFilters;
    results: Product[];
    setResults: (results: Product[]) => void;
    setFilters: (filters: SearchFilters) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    results: [],
    filters:{searchTerm: '',
        categories: [],
        stock: ['All']},
    setResults: (results) => set({ results }),
    setFilters: (filters) => set({filters})
}));
