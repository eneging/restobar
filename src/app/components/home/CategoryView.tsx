"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Utensils, ChevronLeft, Flame } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/types";
import { getProductsByCategory } from "@/services/products";

interface CategoryViewProps {
  initialProducts: Product[];
  slug: string;
}

export default function CategoryView({ initialProducts, slug }: CategoryViewProps) {
  // 1. ESTADO LOCAL
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(false);

  // 2. EFECTO INTELIGENTE
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(slug);
        
        if (data && Array.isArray(data)) {
           const cleanData = data.map((p: any) => ({
             ...p,
             price: Number(p.price) || 0,
             offer_price: p.offer_price ? Number(p.offer_price) : null,
           }));
           setProducts(cleanData);
        }
      } catch (error) {
        console.error("Error al cargar categoría:", error);
      } finally {
        setLoading(false);
      }
    };

    if (initialProducts.length > 0) {
        setProducts(initialProducts);
        setLoading(false);
    } else {
        fetchCategoryData();
    }
    
  }, [slug, initialProducts]);

  const categoryTitle = slug.replace(/-/g, " ");

  return (
    // CONTENEDOR PRINCIPAL RELATIVE (Para que el z-index funcione bien)
    <main className="min-h-screen text-white font-sans selection:bg-orange-500/30 relative overflow-x-hidden">
      
      {/* --- FONDOS FIJOS (Z-INDEX NEGATIVO) --- */}
      <div className="fixed inset-0 bg-[#0a0a0a] z-[-1]" />
      
      {/* Luces Ambientales "Fuego" */}
      <div className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-orange-900/20 via-[#0a0a0a]/80 to-[#0a0a0a] pointer-events-none z-[-1]" />
      <div className="fixed top-[20%] right-[-10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
        
        {/* HEADER DE CATEGORÍA */}
        <div className="mb-12 border-b border-white/5 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">
             <Utensils size={12} /> Menú
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black capitalize tracking-tight text-white mb-2">
            {categoryTitle} <span className="text-orange-600">.</span>
          </h1>
          
          <p className="text-zinc-400 text-lg flex items-center gap-2">
            <span className="font-bold text-white">{products.length}</span> opciones para disfrutar hoy.
          </p>
        </div>

        {loading ? (
          /* ESTADO DE CARGA */
          <div className="flex flex-col justify-center items-center py-32 gap-6">
             <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin relative z-10" />
             </div>
             <p className="text-zinc-500 font-medium animate-pulse">Preparando la carta...</p>
          </div>
        ) : (
          /* GRID DE PRODUCTOS */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  categoryName={categoryTitle} 
                />
              ))
            ) : (
              /* ESTADO VACÍO */
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl text-center px-4">
                <div className="bg-zinc-800 rounded-full p-4 mb-4">
                    <Flame size={32} className="text-zinc-600" />
                </div>
                <h3 className="text-lg font-bold text-white">Se nos acabó el fuego</h3>
                <p className="text-zinc-500 max-w-md mt-2">
                    No encontramos productos en esta categoría por el momento. Intenta buscar otra cosa.
                </p>
                <Link href="/carta" className="mt-6 text-orange-500 hover:text-orange-400 text-sm font-bold hover:underline">
                    Ver toda la carta
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 border-t border-white/5 pt-8 text-center md:text-left">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors font-medium group"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                <ChevronLeft size={16} />
            </div>
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}