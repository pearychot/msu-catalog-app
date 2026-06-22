export const translations = {
  en: {
    // Header
    siteTagline: 'Packaging Catalog',
    productsCount: (n) => `${n} products`,

    // Catalog grid
    filterAll: 'All',
    emptyCategory: 'No products in this category yet.',
    noImage: 'No image',

    // Materials glossary
    glossaryToggle: 'What do these materials mean?',
    glossaryTitle: 'Materials guide',

    // Chat
    greeting:
      "Tell me about your brand and what kind of packaging you're looking for - capacity, material, finish, anything that matters to you - and I'll pull the best matches from our catalog. If you upload your logo, just tell me which product you'd like to preview it on.",
    placeholder: 'Describe your brand and packaging needs...',
    send: 'Send',
    thinking: 'Thinking...',
    uploadLogo: 'Upload your logo',
    logoAttached: 'Logo attached',
    removeAttachment: 'Remove',
    mockupAlt: 'Your logo on the selected product',
    errorReply: 'Something went wrong reaching the assistant. Please try again.',
  },
  th: {
    siteTagline: 'แคตตาล็อกบรรจุภัณฑ์',
    productsCount: (n) => `${n} ผลิตภัณฑ์`,

    filterAll: 'ทั้งหมด',
    emptyCategory: 'ยังไม่มีผลิตภัณฑ์ในหมวดนี้',
    noImage: 'ไม่มีรูปภาพ',

    glossaryToggle: 'วัสดุเหล่านี้คืออะไร?',
    glossaryTitle: 'คู่มือวัสดุ',

    greeting:
      'บอกฉันเกี่ยวกับแบรนด์ของคุณและประเภทบรรจุภัณฑ์ที่คุณกำลังมองหา - ความจุ วัสดุ ผิวสำเร็จ หรือสิ่งที่สำคัญสำหรับคุณ - แล้วฉันจะหาตัวเลือกที่ดีที่สุดจากแคตตาล็อกของเรา หากคุณอัปโหลดโลโก้ บอกฉันได้เลยว่าต้องการดูตัวอย่างบนผลิตภัณฑ์ใด',
    placeholder: 'อธิบายแบรนด์และความต้องการบรรจุภัณฑ์ของคุณ...',
    send: 'ส่ง',
    thinking: 'กำลังคิด...',
    uploadLogo: 'อัปโหลดโลโก้ของคุณ',
    logoAttached: 'แนบโลโก้แล้ว',
    removeAttachment: 'ลบ',
    mockupAlt: 'โลโก้ของคุณบนผลิตภัณฑ์ที่เลือก',
    errorReply: 'เกิดข้อผิดพลาดในการติดต่อผู้ช่วย โปรดลองอีกครั้ง',
  },
};

// Category names come from the database in English. Rather than storing a
// second language in Supabase right now, we translate them here in code -
// keyed by the exact English name as stored in the categories table.
export const categoryTranslations = {
  'Perfume Glass Bottle': 'ขวดแก้วน้ำหอม',
  'Serum Glass Bottle': 'ขวดแก้วเซรั่ม',
  'Airless Bottle': 'ขวดแอร์เลส',
  'Lip Gloss Tube': 'หลอดลิปกลอส',
  'Lipstick Tube': 'หลอดลิปสติก',
  'Eyeshadow Case': 'เคสอายแชโดว์',
  'Compact Powder Case': 'เคสแป้งอัด',
  'Stick / Tube Packaging': 'บรรจุภัณฑ์แบบแท่ง/หลอด',
};

export function translateCategory(name, lang) {
  if (lang !== 'th') return name;
  return categoryTranslations[name] || name;
}

export const materials = [
  {
    abbr: 'PP',
    en: 'Polypropylene — a lightweight, durable, recyclable plastic',
    th: 'โพลิโพรพิลีน — พลาสติกน้ำหนักเบา ทนทาน และรีไซเคิลได้',
  },
  {
    abbr: 'PCR',
    en: 'Post-Consumer Recycled plastic — made from reclaimed plastic waste rather than virgin material',
    th: 'พลาสติกรีไซเคิลหลังการใช้งาน — ผลิตจากพลาสติกที่ผ่านการใช้งานแล้ว แทนการใช้วัตถุดิบใหม่',
  },
  {
    abbr: 'AS / ABS',
    en: 'Acrylonitrile Styrene / Acrylonitrile Butadiene Styrene — rigid, impact-resistant plastics often used for caps and closures',
    th: 'อะคริโลไนไตรล์สไตรีน / อะคริโลไนไตรล์บิวทาไดอีนสไตรีน — พลาสติกแข็ง ทนแรงกระแทก มักใช้สำหรับฝาและตัวปิด',
  },
  {
    abbr: 'PETG',
    en: 'Polyethylene Terephthalate Glycol — a clear, durable plastic often used for bottles',
    th: 'โพลิเอทิลีนเทเรฟทาเลตไกลคอล — พลาสติกใส ทนทาน มักใช้สำหรับขวด',
  },
  {
    abbr: 'PE',
    en: 'Polyethylene — a flexible, chemical-resistant plastic',
    th: 'โพลิเอทิลีน — พลาสติกยืดหยุ่น ทนสารเคมี',
  },
  {
    abbr: 'Glass',
    en: 'Traditional glass, often used for premium perfume and serum bottles',
    th: 'แก้ว — มักใช้สำหรับขวดน้ำหอมและเซรั่มระดับพรีเมียม',
  },
  {
    abbr: 'Metal',
    en: 'Typically aluminum or zinc alloy, used for caps and decorative components',
    th: 'โดยทั่วไปเป็นอะลูมิเนียมหรือสังกะสีผสม ใช้สำหรับฝาและชิ้นส่วนตกแต่ง',
  },
  {
    abbr: 'PVC',
    en: 'Polyvinyl Chloride — a versatile plastic, less common in cosmetic packaging due to recyclability concerns',
    th: 'โพลิไวนิลคลอไรด์ — พลาสติกอเนกประสงค์ พบน้อยในบรรจุภัณฑ์เครื่องสำอางเนื่องจากปัญหาการรีไซเคิล',
  },
  {
    abbr: 'PCTA',
    en: 'A durable, glass-like clear plastic, often used as a glass alternative',
    th: 'พลาสติกใสคล้ายแก้ว ทนทาน มักใช้แทนแก้ว',
  },
];
