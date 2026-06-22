import { getServerSupabase } from '../../../lib/supabaseServer';
import { generateMockup } from '../../../lib/generateMockup';

export const dynamic = 'force-dynamic';

function formatDimension(value) {
  if (!value) return null;
  if (value.includes('/')) {
    const parts = value.split('/').map((v) => v.trim()).filter(Boolean);
    if (parts.length > 1) {
      return `${parts.join('-')} (varies slightly depending on cap/pump fitting)`;
    }
  }
  return value;
}

async function buildCatalogContext(supabase) {
  const { data: products, error } = await supabase
    .from('products')
    .select(
      'item_code, capacity, material, color, neck_size, height_mm, height_b_mm, printing_height_mm, diameter_mm, inner_dimensions, description, categories(name)'
    );

  if (error) {
    console.error('Catalog fetch error:', error);
    return '';
  }

  return products
    .map((p) => {
      const cat = p.categories?.name || 'Uncategorized';
      const parts = [
        p.item_code,
        cat,
        p.capacity ? `capacity:${p.capacity}` : null,
        p.material ? `material:${p.material}` : null,
        p.color ? `color:${p.color}` : null,
        p.neck_size ? `neck_size:${formatDimension(p.neck_size)}` : null,
        p.height_mm ? `height_mm:${formatDimension(p.height_mm)}` : null,
        p.height_b_mm ? `height_b_mm:${formatDimension(p.height_b_mm)}` : null,
        p.printing_height_mm ? `printing_height_mm:${formatDimension(p.printing_height_mm)}` : null,
        p.diameter_mm ? `diameter_mm:${formatDimension(p.diameter_mm)}` : null,
        p.inner_dimensions ? `inner_dimensions:${formatDimension(p.inner_dimensions)}` : null,
        p.description ? `description:${p.description}` : null,
      ]
        .filter(Boolean)
        .join(' | ');
      return parts;
    })
    .join('\n');
}

function extractJson(text) {
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const candidate = cleaned.slice(start, end + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req) {
  try {
    const { messages, logo_base64, language } = await req.json();
    const supabase = getServerSupabase();
    const catalogText = await buildCatalogContext(supabase);

    const logoNote = logo_base64
      ? `\n\nThe customer HAS uploaded a logo image. If they ask to see/preview/visualize their logo on a specific product (one already mentioned in this conversation, or a new one they name by item code), set "mockup_item_code" to that exact item_code. If they haven't asked for a visual preview, leave it null.`
      : `\n\nThe customer has NOT uploaded a logo yet. If they ask to see their logo on a product, let them know in "reply" that they'll need to upload a logo first using the + button next to the chat input, and leave "mockup_item_code" null.`;

    const languageInstruction =
      language === 'th'
        ? `\n\nIMPORTANT: Write your "reply" field in Thai (ภาษาไทย). Keep item codes, materials, and numeric specs exactly as they appear in the catalog (do not translate codes like "T-430" or units like "ml"/"mm") - only the conversational language around them should be in Thai.`
        : `\n\nWrite your "reply" field in English.`;

    const systemPrompt = `You are a packaging consultant for M.S. Union, a B2B cosmetic packaging manufacturer. A potential customer will describe their brand, product, and packaging needs (size, material preference, dimensions, aesthetic, budget hints, etc.).

Your job: recommend the best-matching products from the catalog below, and answer follow-up questions about them using ONLY the data given here. Never invent item codes or specs that aren't in this catalog.

Note on dimension fields: when a dimension shows a range like "83.2-85.2 (varies slightly depending on cap/pump fitting)", explain it to the customer exactly that way - it's normal variation depending on the closure option, not an error.
${logoNote}
${languageInstruction}

Catalog (each line is one product; fields are pipe-separated key:value pairs):
${catalogText}

CRITICAL: Respond with ONLY valid JSON - no apologies, no text before or after, no markdown code fences. Just the raw JSON object, in this exact shape:
{"reply": "a short, friendly, consultative response (2-5 sentences)", "recommended_item_codes": ["CODE1", "CODE2"], "mockup_item_code": "CODE_OR_NULL"}

Recommend up to 5 products when making a new recommendation. For follow-up questions, you can return an empty recommended_item_codes array and just answer in "reply".`;

    const input = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const concentrateRes = await fetch('https://api.concentrate.ai/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONCENTRATE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4-5',
        input,
        max_output_tokens: 1024,
      }),
    });

    if (!concentrateRes.ok) {
      const errText = await concentrateRes.text();
      console.error('Concentrate AI error:', errText);
      return Response.json({ reply: 'Something went wrong reaching the assistant. Please try again.', products: [], mockup_base64: null }, { status: 500 });
    }

    const data = await concentrateRes.json();
    const message = data.output?.find((o) => o.type === 'message');
    const textBlock = message?.content?.find((c) => c.type === 'output_text');
    const rawText = textBlock?.text || '';

    const parsed = extractJson(rawText);

    if (!parsed) {
      return Response.json({ reply: "I had trouble formatting that response - could you rephrase your question?", products: [], mockup_base64: null });
    }

    const codes = parsed.recommended_item_codes || [];
    let products = [];
    if (codes.length > 0) {
      const { data: matched, error: matchError } = await supabase
        .from('products')
        .select('id, item_code, capacity, material, color, description, product_images(storage_path, is_primary)')
        .in('item_code', codes);
      if (matchError) console.error('Product match fetch error:', matchError);
      products = matched || [];
    }

    let mockupBase64 = null;
    if (parsed.mockup_item_code && logo_base64) {
      const { data: mockupProduct } = await supabase
        .from('products')
        .select('item_code, product_images(storage_path)')
        .eq('item_code', parsed.mockup_item_code)
        .limit(1)
        .maybeSingle();

      const storagePath = mockupProduct?.product_images?.[0]?.storage_path;
      if (storagePath) {
        try {
          mockupBase64 = await generateMockup(storagePath, logo_base64);
        } catch (e) {
          console.error('Mockup generation failed:', e);
        }
      }
    }

    return Response.json({ reply: parsed.reply, products, mockup_base64: mockupBase64 });
  } catch (err) {
    console.error('Chat route error:', err);
    return Response.json({ reply: 'Something went wrong. Please try again.', products: [], mockup_base64: null }, { status: 500 });
  }
}
