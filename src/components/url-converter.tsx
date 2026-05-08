"use client"

import * as React from "react"
import {
  GlobeIcon,
  ArrowRightIcon,
  Loader2Icon,
  TagIcon,
  PackageIcon,
  StoreIcon,
  SparklesIcon,
  ExternalLinkIcon,
  ShoppingBagIcon,
} from "lucide-react"

interface Product {
  name: string
  price: string
  originalPrice?: string | null
  description: string
  category: string
  image?: string | null
  badge?: string | null
}

interface StoreData {
  storeName: string
  storeDescription: string
  currency: string
  products: Product[]
  metadata: { title: string; sourceURL: string }
}

export function UrlConverter() {
  const [url, setUrl] = React.useState("")
  const [isConverting, setIsConverting] = React.useState(false)
  const [result, setResult] = React.useState<StoreData | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [filter, setFilter] = React.useState<string>("all")

  const handleConvert = async () => {
    if (!url.trim()) return
    setIsConverting(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Extraction failed")
        return
      }

      setResult(data)
    } catch {
      setError("Network error — could not reach the server.")
    } finally {
      setIsConverting(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const text = e.dataTransfer.getData("text/plain")
    if (text) setUrl(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConvert()
  }

  const categories = React.useMemo(() => {
    if (!result) return []
    const cats = [...new Set(result.products.map((p) => p.category))]
    return cats.sort()
  }, [result])

  const filteredProducts = React.useMemo(() => {
    if (!result) return []
    if (filter === "all") return result.products
    return result.products.filter((p) => p.category === filter)
  }, [result, filter])

  return (
    <div className="flex flex-col gap-8 w-full max-w-full">
      {/* URL Input */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragOver
            ? "border-foreground/40 bg-foreground/[0.03] scale-[1.01]"
            : "border-border hover:border-foreground/20 hover:bg-muted/30"
          }
        `}
      >
        <div className="p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground text-background">
              <StoreIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight uppercase text-foreground/70">
                E-Commerce Spy
              </h2>
              <p className="text-xs text-muted-foreground">
                Paste any online store URL to extract and browse their products
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://store.example.com/collections/all"
                className="
                  w-full h-12 px-4 pr-12 rounded-xl
                  bg-background border border-border
                  text-sm text-foreground placeholder:text-muted-foreground/50
                  focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30
                  transition-all duration-200 font-mono
                "
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                <GlobeIcon className="w-4 h-4" />
              </div>
            </div>
            <button
              onClick={handleConvert}
              disabled={!url.trim() || isConverting}
              className="
                h-12 px-6 rounded-xl bg-foreground text-background
                text-sm font-medium flex items-center gap-2
                hover:opacity-90 active:scale-[0.97]
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-150
              "
            >
              {isConverting ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Extract
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 animate-in fade-in duration-300">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {/* Store Header */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                <ShoppingBagIcon className="w-6 h-6 text-foreground/60" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">{result.storeName}</h2>
                <p className="text-sm text-muted-foreground">{result.storeDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold tabular-nums">{result.products.length}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold tabular-nums">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
              <a
                href={result.metadata.sourceURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ExternalLinkIcon className="w-3.5 h-3.5" />
                Visit Store
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {result && categories.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({result.products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {filteredProducts.map((product, i) => (
            <div
              key={`${product.name}-${i}`}
              className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-foreground/20 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Product Image or Placeholder */}
              <div className="aspect-[4/3] bg-muted/40 relative overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PackageIcon className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                )}
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-foreground text-background text-[10px] font-bold uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-2 p-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
                    <TagIcon className="w-3 h-3" />
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!result && !isConverting && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-5">
            <SparklesIcon className="w-9 h-9 text-muted-foreground/30" />
          </div>
          <p className="text-sm text-muted-foreground/60 max-w-sm">
            Paste an e-commerce store URL above to extract their product catalog. Works with Shopify, WooCommerce, and most online stores.
          </p>
        </div>
      )}

      {/* Loading state */}
      {isConverting && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-5">
            <Loader2Icon className="w-9 h-9 text-muted-foreground animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground/80 font-medium">
            Scraping store & extracting products…
          </p>
          <p className="text-xs text-muted-foreground/40 mt-1">
            Analyzing {url}
          </p>
        </div>
      )}
    </div>
  )
}
