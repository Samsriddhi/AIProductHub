"use client"

import { useState } from "react"
import { ProductsTable } from "@/components/products-table"
import { ProductFilters } from "@/components/product-filters"
import { BulkActions } from "@/components/bulk-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings } from "lucide-react"
import { AddProductModal } from "@/components/add-product-modal"

export function ProductsTableWrapper() {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(true)
  const [activeFilters, setActiveFilters] = useState({
    brand: "all",
    barcode: "",
    material: "all",
    color: "all",
    weight: { min: "", max: "" },
    enrichment: "all",
  })
  const [filteredProductCount, setFilteredProductCount] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // State to store filter options locally
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    materials: [],
    colors: [],
  })

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterChange = (filters) => {
    setActiveFilters(filters)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const refreshProducts = (newProductData) => {
    // If we have new product data, update the filter options immediately
    if (newProductData) {
      // Update brands
      if (newProductData.brand && !filterOptions.brands.includes(newProductData.brand)) {
        setFilterOptions((prev) => ({
          ...prev,
          brands: [...prev.brands, newProductData.brand].sort(),
        }))
      }

      // Update colors
      if (newProductData.color && !filterOptions.colors.includes(newProductData.color)) {
        setFilterOptions((prev) => ({
          ...prev,
          colors: [...prev.colors, newProductData.color].sort(),
        }))
      }

      // Update materials
      if (newProductData.material && !filterOptions.materials.includes(newProductData.material)) {
        setFilterOptions((prev) => ({
          ...prev,
          materials: [...prev.materials, newProductData.material].sort(),
        }))
      }
    }

    // Increment the refresh trigger to cause a re-render
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleProductsDeleted = () => {
    setSelectedProducts([])
    refreshProducts()
  }

  // Function to update filter options from child components
  const updateFilterOptions = (options) => {
    setFilterOptions(options)
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{filteredProductCount} Product(s) in</span>
          <Button variant="outline" size="sm" className="h-8">
            Main Products
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by ID, Product Name, Barcode, or Brand"
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="h-9 flex-1 sm:flex-none" onClick={toggleFilters}>
              <Settings className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <AddProductModal onProductAdded={refreshProducts} />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <ProductFilters
            onFilterChange={handleFilterChange}
            refreshTrigger={refreshTrigger}
            filterOptions={filterOptions}
            onUpdateFilterOptions={updateFilterOptions}
          />
        </div>
      )}

      <BulkActions selectedProducts={selectedProducts} onProductsDeleted={handleProductsDeleted} />

      <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
        <ProductsTable
          key={refreshTrigger}
          onSelectionChange={setSelectedProducts}
          searchQuery={searchQuery}
          filters={activeFilters}
          onProductCountChange={setFilteredProductCount}
          onRefresh={refreshProducts}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-2">
        <span className="text-sm text-muted-foreground">Total {filteredProductCount} product(s)</span>
        {filteredProductCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none">
                1
              </Button>
              {filteredProductCount > 7 && (
                <>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-l-0">
                    2
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">7 / page</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

