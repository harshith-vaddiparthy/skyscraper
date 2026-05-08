import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { url } = await req.json()

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  const firecrawlKey = process.env.FIRECRAWL_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  if (!firecrawlKey || !openaiKey) {
    return NextResponse.json({ error: "API keys not configured" }, { status: 500 })
  }

  try {
    // Step 1: Scrape with Firecrawl
    const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firecrawlKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
      }),
    })

    if (!scrapeRes.ok) {
      const err = await scrapeRes.text()
      return NextResponse.json({ error: `Scrape failed: ${err}` }, { status: scrapeRes.status })
    }

    const scrapeData = await scrapeRes.json()
    const markdown = scrapeData.data?.markdown || ""
    const metadata = scrapeData.data?.metadata || {}

    // Step 2: Extract products with OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a product data extractor. Given scraped markdown from an e-commerce page, extract ALL products you can find. Return JSON with this structure:
{
  "storeName": "string - the store/brand name",
  "storeDescription": "string - brief description of what they sell",
  "currency": "string - currency symbol like $ or €",
  "products": [
    {
      "name": "string - product name",
      "price": "string - price as displayed (e.g. '$29.99')",
      "originalPrice": "string or null - original price if on sale",
      "description": "string - short description (1-2 sentences max)",
      "category": "string - product category",
      "image": "string or null - image URL if found",
      "badge": "string or null - any badge like 'Sale', 'New', 'Bestseller'"
    }
  ]
}
Extract as many products as possible. If no products found, return empty products array.`,
          },
          {
            role: "user",
            content: `Extract products from this e-commerce page (${url}):\n\n${markdown.slice(0, 12000)}`,
          },
        ],
      }),
    })

    if (!openaiRes.ok) {
      const err = await openaiRes.text()
      return NextResponse.json({ error: `AI extraction failed: ${err}` }, { status: 500 })
    }

    const openaiData = await openaiRes.json()
    const extracted = JSON.parse(openaiData.choices[0].message.content)

    return NextResponse.json({
      ...extracted,
      metadata: {
        title: metadata.title || "",
        sourceURL: metadata.sourceURL || url,
      },
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
