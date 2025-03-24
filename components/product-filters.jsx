"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase-client"

export function ProductFilters({
  onFilterChange,
  refreshTrigger = 0,
  filterOptions = null,
  onUpdateFilterOptions = null,
}) {
  // Update the filters state to match the new columns
  const [filters, setFilters] = useState({
    brand: "all",
    barcode: "",
    material: "all",
    color: "all",
    weight: { min: "", max: "" },
    enrichment: "all",
  })

  // State for dynamic filter options (if not provided)
  const [localFilterOptions, setLocalFilterOptions] = useState({
    brands: [],
    materials: [],
    colors: [],
  })

  // Use provided filter options or local ones
  const effectiveFilterOptions = filterOptions || localFilterOptions

  // Fetch filter options from the database
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        console.log("Fetching filter options...")

        // Fetch unique brands
        const { data: brands, error: brandError } = await supabase
          .from("products")
          .select("brand")
          .not("brand", "is", null)
          .order("brand")

        // Fetch unique materials
        const { data: materials, error: materialError } = await supabase
          .from("products")
          .select("material")
          .not("material", "is", null)
          .order("material")

        // Fetch unique colors
        const { data: colors, error: colorError } = await supabase
          .from("products")
          .select("color")
          .not("color", "is", null)
          .order("color")

        if (brandError || materialError || colorError) {
          console.error("Error fetching filter options:", brandError || materialError || colorError)
          return
        }

        // Extract unique values
        const uniqueBrands = [...new Set(brands.map((item) => item.brand).filter(Boolean))]
        const uniqueMaterials = [...new Set(materials.map((item) => item.material).filter(Boolean))]
        const uniqueColors = [...new Set(colors.map((item) => item.color).filter(Boolean))]

        const newOptions = {
          brands: uniqueBrands,
          materials: uniqueMaterials,
          colors: uniqueColors,
        }

        console.log("New filter options:", newOptions)

        // Update local state
        setLocalFilterOptions(newOptions)

        // If parent wants to know about filter options, tell it
        if (onUpdateFilterOptions) {
          onUpdateFilterOptions(newOptions)
        }
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }

    fetchFilterOptions()
  }, [refreshTrigger, onUpdateFilterOptions])

  const handleFilterChange = (key, value) => {
    if (key === "minWeight" || key === "maxWeight") {
      setFilters({
        ...filters,
        weight: {
          ...filters.weight,
          [key === "minWeight" ? "min" : "max"]: value,
        },
      })
    } else {
      setFilters({
        ...filters,
        [key]: value,
      })
    }
  }

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters)
    }
  }

  const handleResetFilters = () => {
    const resetFilters = {
      brand: "all",
      barcode: "",
      material: "all",
      color: "all",
      weight: { min: "", max: "" },
      enrichment: "all",
    }
    setFilters(resetFilters)
    if (onFilterChange) {
      onFilterChange(resetFilters)
    }
  }

  // Replace the filter UI with the new columns
  return (
    <div>
      <div className="text-sm font-medium mb-4">Filter products by</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <div>
          <div className="text-xs mb-1">Brand</div>
          <Select value={filters.brand} onValueChange={(value) => handleFilterChange("brand", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {effectiveFilterOptions.brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="text-xs mb-1">Barcode</div>
          <Input
            type="text"
            placeholder="Enter barcode"
            value={filters.barcode}
            onChange={(e) => handleFilterChange("barcode", e.target.value)}
          />
        </div>
        <div>
          <div className="text-xs mb-1">Material</div>
          <Select value={filters.material} onValueChange={(value) => handleFilterChange("material", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Materials</SelectItem>
              {effectiveFilterOptions.materials.map((material) => (
                <SelectItem key={material} value={material}>
                  {material}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="text-xs mb-1">Color</div>
          <Select value={filters.color} onValueChange={(value) => handleFilterChange("color", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {effectiveFilterOptions.colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <div className="text-xs mb-1">Weight Range (g)</div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="h-10"
              value={filters.weight.min}
              onChange={(e) => handleFilterChange("minWeight", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              className="h-10"
              value={filters.weight.max}
              onChange={(e) => handleFilterChange("maxWeight", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="default" className="h-8" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" className="h-8" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

