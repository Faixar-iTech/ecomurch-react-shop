// Note: TypeScript interfaces are removed during compilation to JavaScript.
// Interfaces only exist at compile time and provide type checking.
// In JavaScript, we rely on runtime validation or PropTypes/JSDoc if needed.

// For reference, the expected object shapes that were defined in TypeScript:
// Product objects should have:
// - id: string
// - name: string  
// - price: number
// - originalPrice?: number (optional)
// - image: string
// - category: string
// - description: string
// - rating: number
// - reviews: number
// - badge?: string (optional)
// - inStock: boolean

// CartItem objects extend Product and add:
// - quantity: number