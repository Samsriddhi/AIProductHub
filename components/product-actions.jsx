"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductEnrichmentModal } from "@/components/product-enrichment-modal"
import { ProductDetailsModal } from "@/components/product-details-modal"
import { ProductEditModal } from "@/components/product-edit-modal"
import { ChevronDown, Sparkles, Edit, Trash, Eye } from "lucide-react"
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

export function ProductActions({ productId, productName, isEnriched, productData, onDelete, onRefresh }) {
  const [enrichModalOpen, setEnrichModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(productId)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              More
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setEnrichModalOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Enrich with AI
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDetailsModalOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProductEnrichmentModal
        open={enrichModalOpen}
        onOpenChange={setEnrichModalOpen}
        productId={productId}
        productName={productName}
        productData={productData}
        onRefresh={onRefresh}
      />

      <ProductDetailsModal open={detailsModalOpen} onOpenChange={setDetailsModalOpen} product={productData} />

      <ProductEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        product={productData}
        onRefresh={onRefresh}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productName}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

