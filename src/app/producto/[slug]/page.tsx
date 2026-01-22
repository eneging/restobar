import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Utensils, Tag, Flame, Clock } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import ProductActions from "@/app/components/ProductActions";
import { getProduct } from "@/services/products";
import type { Product as AppProduct } from "@/app/types"; 

// Helper para limpiar URLs
function slugify(text: any) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const rawProduct = await getProduct(slug);

  if (!rawProduct) notFound();

  // NORMALIZACIÓN
  const cleanProduct: AppProduct = {
    ...rawProduct,
    product_category_id: Number(rawProduct.product_category_id) || 0,
    price: Number(rawProduct.price) || 0,
    offer_price: rawProduct.offer_price ? Number(rawProduct.offer_price) : undefined,
    stock: Number(rawProduct.stock) || 0,
    discount: rawProduct.discount ? Number(rawProduct.discount) : undefined,
    image_url: rawProduct.image_url || "",
    created_at: rawProduct.created_at || "", 
    updated_at: rawProduct.updated_at || "", 
    available: !!rawProduct.available,
    is_offer: !!rawProduct.is_offer,
    category: rawProduct.category,
    id: rawProduct.id,
    name: rawProduct.name || "Sin nombre",
    slug: rawProduct.slug || "",
    description: rawProduct.description || ""
  };

  // VARIABLES
  const price = cleanProduct.price;
  const offerPrice = cleanProduct.offer_price || 0;
  const hasDiscount = Boolean(cleanProduct.is_offer) && offerPrice > 0 && offerPrice < price;
  const priceToShow = hasDiscount ? offerPrice : price;
  
  const categoryId = cleanProduct.category?.id;
  const imageSrc = cleanProduct.image_url && cleanProduct.image_url.startsWith("http") 
    ? cleanProduct.image_url 
    : `/assets/${categoryId}/${cleanProduct.name}.png`;

  return (
    // Estructura Relative para manejar el z-index del fondo
    <div className="min-h-screen relative text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* --- FONDOS FIJOS (Z-INDEX NEGATIVO) --- */}
      <div className="fixed inset-0 bg-[#0a0a0a] z-[-1]" />
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link href="/" className="hover:text-orange-500 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link 
            href={`/categoria/${slugify(cleanProduct.category?.slug || 'carta')}`} 
            className="hover:text-white transition-colors"
          >
            {cleanProduct.category?.name || "Carta"}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-orange-200 font-medium truncate max-w-[200px]">
            {cleanProduct.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Columna Izquierda: Imagen */}
          <div className="relative group rounded-3xl bg-zinc-900/40 border border-zinc-800/50 p-8 flex items-center justify-center overflow-hidden aspect-square lg:aspect-auto lg:h-[600px]">
            {/* Glow Fuego */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative w-full h-full">
                <Image
                    src={imageSrc}
                    alt={cleanProduct.name}
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 ease-out"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {hasDiscount && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm font-black px-4 py-1.5 rounded-lg shadow-lg shadow-orange-900/40 transform -rotate-2">
                    🔥 OFERTA
                </div>
            )}
          </div>

          {/* Columna Derecha: Detalles */}
          <div className="flex flex-col h-full justify-center">
            
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest mb-4">
                <Utensils size={14} />
                {cleanProduct.category?.name || "Plato a la Carta"}
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white leading-[0.95]">
              {cleanProduct.name}
            </h1>

            <div className="flex items-end gap-4 mb-8">
              <div className="text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-100 to-orange-200">
                S/ {priceToShow.toFixed(2)}
              </div>
              
              {hasDiscount && (
                <div className="flex flex-col mb-2">
                    <span className="text-xs text-red-500 font-bold uppercase tracking-wide">Antes</span>
                    <span className="text-xl line-through text-zinc-600 font-bold">
                    S/ {price.toFixed(2)}
                    </span>
                </div>
              )}
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-lg border-l-2 border-orange-500/30 pl-6">
              {cleanProduct.description || "Una explosión de sabor preparada al momento con los mejores ingredientes seleccionados."}
            </p>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-xl">
              <div className="flex-1 h-14"> 
                 {/* Asegúrate de que el AddToCartButton tenga estilos neutros o naranjas */}
                 <AddToCartButton product={cleanProduct} />
              </div>
              <div className="flex items-center gap-2">
                 <ProductActions product={cleanProduct} />
              </div>
            </div>

            {/* Meta Data */}
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="flex items-center gap-4 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800 hover:border-orange-500/30 transition-colors group">
                <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-orange-500/10 transition-colors">
                   <Tag className="w-5 h-5 text-zinc-400 group-hover:text-orange-500" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-0.5">CÓDIGO</span>
                  <span className="block font-mono text-sm text-zinc-300 truncate max-w-[100px]" title={cleanProduct.slug}>
                      {cleanProduct.slug}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800 hover:border-orange-500/30 transition-colors group">
                <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-orange-500/10 transition-colors">
                  <Clock className="w-5 h-5 text-zinc-400 group-hover:text-orange-500" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-0.5">TIEMPO APROX.</span>
                  <span className="block text-white text-sm font-bold">
                      15 - 20 min
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}