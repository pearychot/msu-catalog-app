import { supabase } from '../lib/supabaseClient';
import CatalogGrid from '../components/CatalogGrid';
import ChatAssistant from '../components/ChatAssistant';
import SiteHeader from '../components/SiteHeader';
import { LanguageProvider } from '../lib/LanguageContext';

export const revalidate = 0; // always fetch fresh data for now

async function getCatalogData() {
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, item_code, category_id, capacity, material, product_images(storage_path, is_primary)')
    .order('item_code');

  if (catError) console.error('Category fetch error:', catError);
  if (prodError) console.error('Product fetch error:', prodError);

  return {
    categories: categories ?? [],
    products: products ?? [],
  };
}

export default async function HomePage() {
  const { categories, products } = await getCatalogData();

  return (
    <LanguageProvider>
      <div className="page">
        <SiteHeader productCount={products.length} />

        <ChatAssistant />

        <CatalogGrid products={products} categories={categories} />
      </div>
    </LanguageProvider>
  );
}
