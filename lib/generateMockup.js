import sharp from 'sharp';

function getPublicImageUrl(storagePath) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/product-images/${storagePath}`;
}

// Composites an uploaded logo onto a product photo. Simple, predictable
// placement: logo scaled to ~22% of the product image's width, centered
// horizontally, positioned at roughly the lower-middle body of the bottle.
// Not perspective-aware - this is a flat overlay, not a rendered mockup.
export async function generateMockup(storagePath, logoBase64) {
  const productImageUrl = getPublicImageUrl(storagePath);
  const productRes = await fetch(productImageUrl);
  if (!productRes.ok) {
    throw new Error('Could not fetch product image');
  }
  const productBuffer = Buffer.from(await productRes.arrayBuffer());

  const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, '');
  const logoBuffer = Buffer.from(base64Data, 'base64');

  const productImage = sharp(productBuffer);
  const metadata = await productImage.metadata();
  const productWidth = metadata.width || 600;
  const productHeight = metadata.height || 600;

  const logoTargetWidth = Math.round(productWidth * 0.22);
  const resizedLogo = await sharp(logoBuffer).resize({ width: logoTargetWidth }).toBuffer();
  const logoMeta = await sharp(resizedLogo).metadata();

  const left = Math.round((productWidth - logoMeta.width) / 2);
  const top = Math.round(productHeight * 0.55 - logoMeta.height / 2);

  const composited = await productImage
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();

  return `data:image/png;base64,${composited.toString('base64')}`;
}
