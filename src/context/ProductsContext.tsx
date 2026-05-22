import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { products as defaultProducts, type Product } from '../data/products'

const STORAGE_KEY = 'knets_brew_products_v2'

interface ProductsContextValue {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleAvailable: (id: string) => void
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Product[]
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore
    }
    return defaultProducts
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: `product-${Date.now()}` }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((current) => current.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((current) => current.filter((p) => p.id !== id))
  }

  const toggleAvailable = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: p.available === false ? true : false } : p)),
    )
  }

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, toggleAvailable }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) throw new Error('useProducts must be inside ProductsProvider')
  return context
}
