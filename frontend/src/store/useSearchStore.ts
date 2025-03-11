import { create } from 'zustand';

export interface Product{
    id: number;
    name: string;
    category: string[]
    unitPrice: number;
    expDate: string;
    quantityStock: number;
    creationDate: string;
    updateDate: string;
}


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
