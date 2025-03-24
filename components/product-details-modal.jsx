"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProductDetailsModal({ open, onOpenChange, product }) {
  if (!product) return null

  // Helper function to format ingredients
  const formatIngredients = (ingredients) => {
    if (!ingredients) return "N/A"

    if (typeof ingredients === "string") {
      return ingredients
    }

    if (typeof ingredients === "object") {
      return Object.entries(ingredients).map(([category, items]) => (
        <div key={category} className="mb-2">
          <span className="font-medium">{category}:</span>{" "}
          {Array.isArray(items) ? items.join(", ") : typeof items === "string" ? items : JSON.stringify(items)}
        </div>
      ))
    }

    return JSON.stringify(ingredients)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Detailed information for {product.product_name} ({product.id})
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <img
                src={product.product_image || "/placeholder.svg?height=200&width=200"}
                alt={product.product_name}
                className="h-48 w-48 object-contain border rounded-md p-2"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="col-span-2">{product.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="col-span-2">{product.product_name}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Barcode:</span>
                  <span className="col-span-2">{product.barcode || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="col-span-2">{product.brand || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Items per Package:</span>
                  <span className="col-span-2">{product.items_per_package || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Warranty:</span>
                  <span className="col-span-2">
                    {product.warranty ? `${product.warranty} year${product.warranty !== 1 ? "s" : ""}` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Physical Attributes</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="col-span-2">
                    {product.item_weight ? `${product.item_weight} ${product.weight_unit || ""}` : "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="col-span-2">
                    {product.width || product.height
                      ? `${product.width || 0} × ${product.height || 0} ${product.dimension_unit || ""}`
                      : "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="col-span-2">{product.color || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Material:</span>
                  <span className="col-span-2">{product.material || "N/A"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Storage:</span>
                  <span className="col-span-2">{product.storage_requirements || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm">{product.product_description || "No description available."}</p>
            </div>

            {product.ingredients && (
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-medium mb-1">Ingredients</h3>
                <div className="text-sm">{formatIngredients(product.ingredients)}</div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

