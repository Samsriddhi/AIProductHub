"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ProductActions } from "@/components/product-actions"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"

export function ProductsTable({ onSelectionChange, searchQuery, filters, onProductCountChange }) {
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const { toast } = useToast()

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.from("products").select("*")

      if (error) {
        throw error
      }

      setAllProducts(data || [])
      setFilteredProducts(data || [])

      // Update product count
      if (onProductCountChange) {
        onProductCountChange(data?.length || 0)
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) {
        throw error
      }

      // Refresh products after deletion
      fetchProducts()

      toast({
        title: "Success",
        description: "Product deleted successfully",
      })

      // Remove from selected IDs if it was selected
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
      }
    } catch (err) {
      console.error("Error deleting product:", err)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete multiple products
  const deleteSelectedProducts = async (ids) => {
    try {
      const { error } = await supabase.from("products").delete().in("id", ids)

      if (error) {
        throw error
      }

      // Refresh products after deletion
      fetchProducts()

      toast({
        title: "Success",
        description: `${ids.length} products deleted successfully`,
      })

      // Clear selected IDs
      setSelectedIds([])
    } catch (err) {
      console.error("Error deleting products:", err)
      toast({
        title: "Error",
        description: "Failed to delete products. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredProducts.map((product) => product.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectProduct = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Apply search and filters
  useEffect(() => {
    if (!allProducts.length) return

    let result = [...allProducts]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          (product.product_name && product.product_name.toLowerCase().includes(query)) ||
          (product.id && product.id.toString().toLowerCase().includes(query)) ||
          (product.brand && product.brand.toLowerCase().includes(query)) ||
          (product.barcode && product.barcode.toString().toLowerCase().includes(query)),
      )
    }

    // Apply filters
    if (filters) {
      if (filters.brand && filters.brand !== "all") {
        result = result.filter(
          (product) => product.brand && product.brand.toLowerCase() === filters.brand.toLowerCase(),
        )
      }

      if (filters.barcode) {
        result = result.filter((product) => product.barcode && product.barcode.toString().includes(filters.barcode))
      }

      if (filters.material && filters.material !== "all") {
        result = result.filter(
          (product) => product.material && product.material.toLowerCase() === filters.material.toLowerCase(),
        )
      }

      if (filters.color && filters.color !== "all") {
        result = result.filter(
          (product) => product.color && product.color.toLowerCase() === filters.color.toLowerCase(),
        )
      }

      if (filters.weight && filters.weight.min) {
        result = result.filter(
          (product) => product.item_weight && product.item_weight >= Number.parseFloat(filters.weight.min),
        )
      }

      if (filters.weight && filters.weight.max) {
        result = result.filter(
          (product) => product.item_weight && product.item_weight <= Number.parseFloat(filters.weight.max),
        )
      }
    }

    setFilteredProducts(result)

    // Update product count
    if (onProductCountChange) {
      onProductCountChange(result.length)
    }

    // Reset selection when filters change
    setSelectedIds([])
    setSelectAll(false)
  }, [searchQuery, filters, allProducts, onProductCountChange])

  // Update selection state
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedIds)
    }
  }, [selectedIds, onSelectionChange])

  useEffect(() => {
    setSelectAll(selectedIds.length === filteredProducts.length && filteredProducts.length > 0)
  }, [selectedIds, filteredProducts])

  if (isLoading) {
    return (
      <div className="border rounded-md p-8 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border rounded-md p-8">
        <div className="text-center text-destructive">
          <p>{error}</p>
          <button onClick={fetchProducts} className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="w-10 p-2">
              <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
            </th>
            <th className="w-10"></th>
            <th className="text-left p-2 font-medium text-sm">ID</th>
            <th className="text-left p-2 font-medium text-sm">Product Name</th>
            <th className="text-left p-2 font-medium text-sm">Barcode</th>
            <th className="text-left p-2 font-medium text-sm">Brand</th>
            <th className="text-left p-2 font-medium text-sm">Weight</th>
            <th className="text-left p-2 font-medium text-sm">Material</th>
            <th className="text-left p-2 font-medium text-sm">Color</th>
            <th className="text-left p-2 font-medium text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-muted/20">
                <td className="p-2">
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td className="p-2">
                  <img
                    src={product.product_image || "/placeholder.svg?height=50&width=50"}
                    alt={product.product_name}
                    className="h-10 w-10 object-contain"
                  />
                </td>
                <td className="p-2 text-sm">{product.id}</td>
                <td className="p-2 text-sm">{product.product_name}</td>
                <td className="p-2 text-sm">{product.barcode}</td>
                <td className="p-2 text-sm">{product.brand}</td>
                <td className="p-2 text-sm">
                  {product.item_weight} {product.weight_unit}
                </td>
                <td className="p-2 text-sm">{product.material}</td>
                <td className="p-2 text-sm">{product.color}</td>
                <td className="p-2">
                  <ProductActions
                    productId={product.id}
                    productName={product.product_name}
                    productData={product}
                    onDelete={() => deleteProduct(product.id)}
                    onRefresh={fetchProducts}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="p-4 text-center text-muted-foreground">
                No products found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

