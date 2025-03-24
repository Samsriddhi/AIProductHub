import "@/app/globals.css"

export const metadata = {
  title: "AI Product Hub",
  description: "Enrich product data with AI",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-gray-100">
      <body>{children}</body>
    </html>
  )
}



import './globals.css'