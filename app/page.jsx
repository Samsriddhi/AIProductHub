import { ProductsTableWrapper } from "@/components/products-table-wrapper"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <h1 className="text-xl font-semibold">AI Product Hub</h1>
        </div>
      </header>
      <main className="flex-1 container px-4 py-8 mx-auto max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <ProductsTableWrapper />
        </div>
      </main>
      <footer className="py-4 border-t bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          AI Product Hub &copy; {new Date().getFullYear()}
        </div>
      </footer>
      <Toaster />
    </div>
  )
}

