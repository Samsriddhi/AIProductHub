"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus } from "lucide-react"

export function AddProductModal({ onProductAdded }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    product_name: "",
    barcode: "",
    brand: "",
    product_image: "",
    item_weight: "",
    weight_unit: "g",
    product_description: "",
    storage_requirements: "",
    items_per_package: "1",
    color: "",
    material: "",
    width: "",
    height: "",
    dimension_unit: "mm",
    warranty: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateRandomId = () => {
    // Generate a random number between 10000000 and 99999999
    const randomId = Math.floor(10000000 + Math.random() * 90000000)
    setFormData((prev) => ({
      ...prev,
      id: randomId.toString(),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.id) {
        throw new Error("Product ID is required")
      }

      // Convert numeric fields, but only if they have values
      const numericFields = ["id", "barcode", "item_weight", "items_per_package", "width", "height", "warranty"]
      const processedData = { ...formData }

      numericFields.forEach((field) => {
        if (processedData[field] && processedData[field] !== "") {
          processedData[field] = Number(processedData[field])
        } else if (field === "id") {
          throw new Error("Product ID is required and must be a number")
        } else {
          // Remove empty fields to avoid type conversion errors
          delete processedData[field]
        }
      })

      const { data, error } = await supabase.from("products").insert([processedData]).select()

      if (error) throw error

      toast({
        title: "Success",
        description: "Product added successfully",
      })

      // Reset form
      setFormData({
        id: "",
        product_name: "",
        barcode: "",
        brand: "",
        product_image: "",
        item_weight: "",
        weight_unit: "g",
        product_description: "",
        storage_requirements: "",
        items_per_package: "1",
        color: "",
        material: "",
        width: "",
        height: "",
        dimension_unit: "mm",
        warranty: "",
      })

      // Close modal
      setOpen(false)

      // Refresh product list and filters
      if (onProductAdded) {
        // Pass the new product data to help update filters immediately
        onProductAdded({
          brand: processedData.brand,
          color: processedData.color,
          material: processedData.material,
        })
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: `Failed to add product: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Fill in the details to add a new product to your inventory.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Product ID * (Numeric only)</Label>
              <div className="flex gap-2">
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  type="number"
                  required
                  placeholder="Enter numeric ID"
                />
                <Button type="button" variant="outline" onClick={generateRandomId} className="whitespace-nowrap">
                  Generate ID
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_name">Product Name *</Label>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

