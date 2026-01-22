"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { Minus, Plus, ShoppingCart, Loader2, Check, Utensils } from "lucide-react";
import { toast } from "sonner"; // Asegúrate de tener instalada una librería de toast (sonner, react-hot-toast, etc.)
import type { Product } from "@/app/types";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  
  // Estado local para cantidad y UI
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  // Validación de stock (si es restobar, a veces el stock es infinito, pero mantenemos la lógica por seguridad)
  const stock = typeof product.stock === 'number' ? product.stock : 100; 
  const isOutOfStock = stock <= 0;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    
    setLoading(true);
    
    // Simulamos un pequeño delay para que la animación se vea bien (UX)
    await new Promise(resolve => setTimeout(resolve, 500));

    addToCart(product, quantity);
    
    setLoading(false);
    setAdded(true);
    
    // Notificación
    toast.success(`¡Listo! Agregamos ${quantity} ${product.name} a tu pedido. 🍔`);
    
    // Resetear el estado de "Agregado" después de 2 segundos
    setTimeout(() => {
        setAdded(false);
        setQuantity(1); // Opcional: resetear cantidad a 1
    }, 2000);
  };

  return (
    <div className="flex gap-4 w-full h-full">
      
      {/* 1. SELECTOR DE CANTIDAD */}
      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-2 h-full shadow-inner shadow-black/50">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1 || isOutOfStock || loading}
          className="p-3 text-zinc-500 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-90"
        >
          <Minus size={18} />
        </button>
        
        <span className="w-8 text-center font-black text-white text-lg tabular-nums">
          {quantity}
        </span>

        <button
          onClick={handleIncrease}
          disabled={quantity >= stock || isOutOfStock || loading}
          className="p-3 text-zinc-500 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-90"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* 2. BOTÓN DE ACCIÓN (Estilo Fuego) */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || loading || added}
        className={`
          flex-1 h-full rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-300 transform active:scale-[0.98]
          ${isOutOfStock 
            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700"
            : added
              ? "bg-green-600 shadow-green-900/40 border border-green-500"
              : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-orange-900/30 border border-orange-500/20"
          }
        `}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={22} />
        ) : added ? (
          <>
            <Check size={22} className="stroke-[3px]" />
            <span>¡Anotado!</span>
          </>
        ) : isOutOfStock ? (
          <span>Agotado</span>
        ) : (
          <>
            <Utensils size={20} className="stroke-[2.5px]" />
            <span>Pedir Ahora</span>
          </>
        )}
      </button>
    </div>
  );
}