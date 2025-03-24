"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function ProductEditModal({ open, onOpenChange, product, onRefresh }) {
  const [formData, setFormData] = useState({
    product_name: "",
    barcode: "",
    brand: "",
    product_image: "",
    item_weight: "",
    weight_unit: "",
    product_description: "",
    storage_requirements: "",
    items_per_package: "",
    color: "",
    material: "",
    width: "",
    height: "",
    dimension_unit: "",
    warranty: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (product && open) {
      setFormData({
        product_name: product.product_name || "",
        barcode: product.barcode || "",
        brand: product.brand || "",
        product_image: product.product_image || "",
        item_weight: product.item_weight || "",
        weight_unit: product.weight_unit || "",
        product_description: product.product_description || "",
        storage_requirements: product.storage_requirements || "",
        items_per_package: product.items_per_package || "",
        color: product.color || "",
        material: product.material || "",
        width: product.width || "",
        height: product.height || "",
        dimension_unit: product.dimension_unit || "",
        warranty: product.warranty || "",
      })
    }
  }, [product, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert numeric fields, but only if they have values
      const numericFields = ["barcode", "item_weight", "items_per_package", "width", "height", "warranty"]
      const processedData = { ...formData }

      numericFields.forEach((field) => {
        if (processedData[field] && processedData[field] !== "") {
          processedData[field] = Number(processedData[field])
        } else {
          // Set to null to avoid type conversion errors
          processedData[field] = null
        }
      })

      const { error } = await supabase.from("products").update(processedData).eq("id", product.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Product updated successfully",
      })

      if (onRefresh) {
        onRefresh()
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update the product information for {product?.product_name}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_name">Product Name</Label>
              <Input
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" name="barcode" value={formData.barcode} onChange={handleChange} type="number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_image">Product Image URL</Label>
              <Input
                id="product_image"
                name="product_image"
                value={formData.product_image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item_weight">Weight</Label>
              <Input
                id="item_weight"
                name="item_weight"
                value={formData.item_weight}
                onChange={handleChange}
                type="number"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_unit">Weight Unit</Label>
              <Input
                id="weight_unit"
                name="weight_unit"
                value={formData.weight_unit}
                onChange={handleChange}
                placeholder="g, kg, oz, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" value={formData.color} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input id="material" name="material" value={formData.material} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input id="width" name="width" value={formData.width} onChange={handleChange} type="number" step="0.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                type="number"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimension_unit">Dimension Unit</Label>
              <Input
                id="dimension_unit"
                name="dimension_unit"
                value={formData.dimension_unit}
                onChange={handleChange}
                placeholder="mm, cm, in, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="items_per_package">Items Per Package</Label>
              <Input
                id="items_per_package"
                name="items_per_package"
                value={formData.items_per_package}
                onChange={handleChange}
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty (Years)</Label>
              <Input id="warranty" name="warranty" value={formData.warranty} onChange={handleChange} type="number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage_requirements">Storage Requirements</Label>
              <Input
                id="storage_requirements"
                name="storage_requirements"
                value={formData.storage_requirements}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_description">Product Description</Label>
            <Textarea
              id="product_description"
              name="product_description"
              value={formData.product_description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

