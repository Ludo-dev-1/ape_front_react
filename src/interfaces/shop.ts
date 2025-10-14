

// Définition du type du store Zustand
export interface CartState {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, newQuantity: number) => void;
    clearCart: () => void;
}

export interface Sale {
    products: never[];
    id: number;
    name: string;
    start_date: number;
    end_date: number;
    is_active: boolean;
    picture?: string;
}

export interface Product {
    quantity: number;
    id: number;
    sale_id: number;
    is_active: boolean;
    name: string;
    price: number;
    stock: number;
    image_url?: string;
    description?: string;
    saleName?: string; // Ajouté pour afficher le nom de la vente dans CartPage
}

export interface ProductInput {
    id?: number;
    tempId?: string;
    name: string;
    price: string;
    stock: string;
    description: string;
    imageFile: File | null;
    image_url?: string; // ✅ on la rend optionnelle
}


export interface SaleInput {
    id: any;
    name: string;
    start_date: string;
    end_date: string;
    is_active?: boolean;
    picture?: File | null;
    products: ProductInput[];
}

