"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function BulkActions({ selectedProducts, onProductsDeleted }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleBulkDelete = async () => {
    if (!selectedProducts.length) return

    setIsDeleting(true)

    try {
      const { error } = await supabase.from("products").delete().in("id", selectedProducts)

      if (error) throw error

      toast({
        title: "Success",
        description: `${selectedProducts.length} products deleted successfully`,
      })

      if (onProductsDeleted) {
        onProductsDeleted()
      }
    } catch (err) {
      console.error("Error deleting products:", err)
      toast({
        title: "Error",
        description: "Failed to delete products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-destructive"
          disabled={selectedProducts.length === 0 || isDeleting}
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Selected ({selectedProducts.length})
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedProducts.length} selected products. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

