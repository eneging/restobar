"use client";

import React from "react";
import Image from "next/image";
import { Flame, ShoppingCart, AlertCircle, Utensils, ChevronRight } from "lucide-react";
import { useStoreData } from "../hooks/useStoreData";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const PromocionesPage = () => {
  const { products, categories, loading, error } = useStoreData();
  const { addToCart } = useCart();

  const offerProducts = products.filter((p) => p.is_offer);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-28 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-zinc-900 border border-zinc-800 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 px-4 flex justify-center">
        <div className="max-w-xl w-full p-4 flex items-center gap-3 text-red-400 bg-red-950/20 border border-red-900/50 rounded-2xl backdrop-blur-sm">
          <AlertCircle size={24} />
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (offerProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 px-4 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-600">
            <Utensils size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">La parrilla está apagada</h2>
        <p className="text-zinc-500">No hay promociones activas en este momento.</p>
      </div>
    );
  }

  return (
    // 🔴 CAMBIO 1: Quitamos bg-[#0a0a0a] de aquí y usamos relative
    <main className="min-h-screen text-white font-sans selection:bg-orange-500/30 relative overflow-x-hidden">
      
      {/* 🔴 CAMBIO 2: Fondo Sólido Fijo con z-[-1] (Detrás de todo) */}
      <div className="fixed inset-0 bg-[#0a0a0a] z-[-1]" />

      {/* 🔴 CAMBIO 3: Luces Ambientales Fijas con z-[-1] */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-orange-950/20 via-black/80 to-black pointer-events-none z-[-1]" />
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      
      {/* Contenido (z-10 para estar encima del fondo) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-28">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-white/5 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">
               <Flame size={12} className="fill-orange-500 animate-pulse" /> Ofertas Limitadas
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Promociones <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Calientes</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-sm max-w-xs text-right hidden md:block">
             Aprovecha los mejores descuentos en hamburguesas, alitas y tragos seleccionados.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {offerProducts.map((product, index) => {
            const category = categories.find(
              (c) => c.id === product.product_category_id
            );

            const discount = Math.round(
              ((Number(product.price) - Number(product.offer_price)) /
                Number(product.price)) * 100
            );

            const imageSrc =
              product.image_url && product.image_url.startsWith("http")
                ? product.image_url
                : `/assets/${product.category?.id}/${product.name}.png`;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-900/20 flex flex-col overflow-hidden"
              >
                {/* Badge Descuento */}
                <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[10px] md:text-xs font-black px-2.5 py-1 rounded-lg shadow-lg rotate-[-2deg] group-hover:rotate-0 transition-transform">
                  -{discount}%
                </div>

                {/* Imagen */}
                <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-zinc-800/50 to-zinc-900 p-4 overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1 bg-zinc-900 relative z-10 -mt-2">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                       <Utensils size={10} /> {category?.name || "Promo"}
                    </p>

                    <h3 className="text-white text-sm font-bold line-clamp-2 leading-snug mb-3 min-h-[2.5em] group-hover:text-orange-400 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-xl font-black text-white">
                        S/ {Number(product.offer_price).toFixed(2)}
                      </span>
                      <span className="text-xs text-zinc-500 line-through mb-1">
                        S/ {Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-zinc-800 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 group/btn border border-zinc-700 hover:border-transparent"
                  >
                    <ShoppingCart size={16} className="group-hover/btn:animate-bounce" />
                    Pedir
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default PromocionesPage;