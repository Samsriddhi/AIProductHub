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
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

// This component is no longer used but kept for reference
export function BulkEnrichmentModal({ open, onOpenChange, selectedProducts }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleStartEnrichment = () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate AI enrichment process with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setCompleted(true)
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 500)
  }

  const handleClose = () => {
    if (!isProcessing) {
      setCompleted(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Enrich Products with AI</DialogTitle>
          <DialogDescription>
            {selectedProducts.length > 0
              ? `Enrich ${selectedProducts.length} selected products with AI-generated attributes.`
              : "Select products to enrich with AI-generated attributes."}
          </DialogDescription>
        </DialogHeader>

        {!isProcessing && !completed ? (
          <div className="py-4">
            <p className="text-sm mb-4">The AI will analyze the existing product data and generate:</p>
            <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
              <li>Detailed product descriptions</li>
              <li>Appropriate product categories</li>
              <li>Relevant tags</li>
              <li>Material information</li>
              <li>Feature highlights</li>
              <li>Recommended use cases</li>
            </ul>
            <p className="text-sm text-muted-foreground mb-2">
              This process may take several minutes depending on the number of products.
            </p>
            {selectedProducts.length === 0 && (
              <p className="text-sm text-destructive">Please select at least one product to continue.</p>
            )}
          </div>
        ) : completed ? (
          <div className="py-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Enrichment Complete</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Successfully enriched {selectedProducts.length} products with AI-generated attributes.
            </p>
          </div>
        ) : (
          <div className="py-6">
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-right mt-1">{progress}% complete</p>
            </div>
            <p className="text-sm text-center">Enriching products with AI... This may take a few minutes.</p>
          </div>
        )}

        <DialogFooter>
          {!isProcessing && !completed ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleStartEnrichment} disabled={selectedProducts.length === 0}>
                Start Enrichment
              </Button>
            </>
          ) : completed ? (
            <Button
              onClick={() => {
                setCompleted(false)
                onOpenChange(false)
              }}
            >
              Done
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Processing...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

