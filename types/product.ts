export type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    category: 'Tops' | 'Pants' | 'Outerwear';
    images: string[];
    sizes: Array<'S' | 'M' | 'L' | 'XL'>;
    colors?: string[];
    featured?: boolean;
    newArrival?: boolean;
};
