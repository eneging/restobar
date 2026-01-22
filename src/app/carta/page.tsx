"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Utensils, 
  Beer, 
  Wine, 
  Flame, 
  ChevronRight, 
  Plus, 
  ShoppingBag,
  Info
} from "lucide-react";
import { useStoreData } from "../hooks/useStoreData";
import { useCart } from "../context/CartContext";
import Link from "next/link";

// --- COMPONENTES AUXILIARES ---

// Icono dinámico según categoría
const CategoryIcon = ({ name }: { name: string }) => {
  const n = name.toLowerCase();
  if (n.includes("hamburguesa") || n.includes("burger")) return <span className="text-xl">🍔</span>;
  if (n.includes("alita") || n.includes("wing")) return <span className="text-xl">🍗</span>;
  if (n.includes("trago") || n.includes("coctel")) return <span className="text-xl">🍹</span>;
  if (n.includes("cerveza")) return <Beer size={18} />;
  if (n.includes("vino")) return <Wine size={18} />;
  if (n.includes("piqueo")) return <Utensils size={18} />;
  return <Flame size={18} />;
};

export default function CartaPage() {
  const { products, categories, loading } = useStoreData();
  const { addToCart } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // --- LÓGICA DE FILTRADO ---
  const filteredProducts = useMemo(() => {
    let data = products;

    // 1. Filtro por Categoría
    if (selectedCategory !== "all") {
      data = data.filter((p) => 
        Number(p.category?.id || p.product_category_id) === selectedCategory
      );
    }

    // 2. Filtro por Búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((p) => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );
    }

    return data;
  }, [products, selectedCategory, searchQuery]);

  // Obtener categorías activas (que tengan productos)
  const activeCategories = useMemo(() => {
    const validIds = new Set(products.map(p => Number(p.category?.id || p.product_category_id)));
    return categories.filter(c => validIds.has(c.id));
  }, [categories, products]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30 pb-24 relative">
      
      {/* Fondo Ambiental Fijo */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        
        {/* --- HERO HEADER --- */}
        <header className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-4"
          >
            <Utensils size={14} /> Menú Digital
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
            Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Carta</span>
          </h1>

          {/* Buscador Principal */}
          <div className="relative max-w-md mx-auto group">
            <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-orange-500 transition-colors shadow-xl">
               <Search className="ml-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={20} />
               <input 
                 type="text"
                 placeholder="¿Qué se te antoja hoy? (Ej. Alitas, Whisky...)"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-transparent text-white p-4 outline-none placeholder:text-zinc-600 font-medium"
               />
            </div>
          </div>
        </header>

        {/* --- NAVEGACIÓN STICKY DE CATEGORÍAS --- */}
        <div className="sticky top-20 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-y border-white/5 py-4 mb-8 shadow-2xl shadow-black/50">
           <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 min-w-max px-2">
                 {/* Botón "Todos" */}
                 <button
                    onClick={() => setSelectedCategory("all")}
                    className={`relative px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                       selectedCategory === "all" 
                       ? "text-white bg-gradient-to-r from-orange-600 to-red-600 shadow-lg shadow-orange-900/40 scale-105" 
                       : "text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white"
                    }`}
                 >
                    <Utensils size={16} />
                    Todos
                 </button>

                 {/* Categorías Dinámicas */}
                 {activeCategories.map((cat) => (
                    <button
                       key={cat.id}
                       onClick={() => setSelectedCategory(cat.id)}
                       className={`relative px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                          selectedCategory === cat.id 
                          ? "text-white bg-gradient-to-r from-orange-600 to-red-600 shadow-lg shadow-orange-900/40 scale-105" 
                          : "text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                       }`}
                    >
                       <CategoryIcon name={cat.name} />
                       <span className="capitalize">{cat.name}</span>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* --- GRID DE PRODUCTOS --- */}
        <div className="max-w-7xl mx-auto px-4 min-h-[50vh]">
           
           {loading ? (
              /* Loading Skeleton */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-40 bg-zinc-900/50 rounded-3xl animate-pulse border border-zinc-800" />
                 ))}
              </div>
           ) : filteredProducts.length > 0 ? (
              
              <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                 <AnimatePresence>
                    {filteredProducts.map((product) => {
                       const hasDiscount = Boolean(product.is_offer) && Number(product.offer_price) > 0;
                       
                       return (
                          <motion.div
                             layout
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.9 }}
                             transition={{ duration: 0.3 }}
                             key={product.id}
                             className="group relative bg-zinc-900/60 border border-zinc-800 hover:border-orange-500/40 rounded-3xl p-4 flex gap-4 overflow-hidden transition-all hover:shadow-2xl hover:shadow-orange-900/10 hover:bg-zinc-900"
                          >
                             {/* Imagen Izquierda (Cuadrada) */}
                             <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 relative bg-black/20 rounded-2xl overflow-hidden self-center">
                                <Image 
                                   src={product.image_url || `/assets/${product.category?.id}/${product.name}.png`}
                                   alt={product.name}
                                   fill
                                   className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {hasDiscount && (
                                   <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg shadow-md">
                                      OFERTA
                                   </div>
                                )}
                             </div>

                             {/* Info Derecha */}
                             <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                   <div className="flex justify-between items-start gap-2">
                                      <h3 className="font-bold text-white leading-tight group-hover:text-orange-400 transition-colors line-clamp-2">
                                         {product.name}
                                      </h3>
                                      <Link href={`/producto/${product.slug}`}>
                                         <Info size={16} className="text-zinc-600 hover:text-white transition-colors" />
                                      </Link>
                                   </div>
                                   
                                   <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                                      {product.description || "Deliciosa preparación de la casa con ingredientes seleccionados."}
                                   </p>
                                </div>

                                <div className="flex items-end justify-between mt-3">
                                   <div className="flex flex-col">
                                      {hasDiscount && (
                                         <span className="text-[10px] text-zinc-500 line-through decoration-red-500/50">
                                            S/ {Number(product.price).toFixed(2)}
                                         </span>
                                      )}
                                      <span className="text-lg font-black text-white">
                                         S/ {hasDiscount ? Number(product.offer_price).toFixed(2) : Number(product.price).toFixed(2)}
                                      </span>
                                   </div>

                                   <button 
                                      onClick={() => addToCart(product)}
                                      className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-orange-600 text-white flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-black/20 group/btn"
                                   >
                                      <Plus size={20} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                                   </button>
                                </div>
                             </div>
                          </motion.div>
                       );
                    })}
                 </AnimatePresence>
              </motion.div>

           ) : (
              /* Estado Vacío */
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                 <Utensils size={48} className="text-zinc-600 mb-4" />
                 <h3 className="text-xl font-bold text-zinc-400">No encontramos nada aquí</h3>
                 <p className="text-zinc-600">Intenta con otra categoría o busca algo diferente.</p>
              </div>
           )}

        </div>

      </div>
    </div>
  );
}