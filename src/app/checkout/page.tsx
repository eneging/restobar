"use client";

import { useMemo, useState, useEffect, memo, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CheckoutCulqi from "../components/CheckoutCulqi";
import { motion, AnimatePresence } from "framer-motion"; 
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  ShoppingBag, 
  AlertCircle, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Flame, // Icono Restobar
  UtensilsCrossed
} from "lucide-react";

// ----------------------------------------------------------------------
// 1. COMPONENTE INPUTFIELD (Estilo Restobar - Orange)
// ----------------------------------------------------------------------
const InputField = memo(({ 
  label, 
  icon: Icon, 
  error,
  disabled = false,
  ...props 
}: any) => (
  <div className="relative group w-full">
    <div className="flex justify-between items-end mb-2 ml-1">
      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
        {label}
      </label>
      {error && (
        <span className="text-orange-400 text-[10px] font-medium flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-full animate-fadeIn">
          <AlertCircle className="w-3 h-3" /> Requerido
        </span>
      )}
    </div>
    
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className={`h-5 w-5 transition-colors duration-300 ${
          disabled ? "text-zinc-600" : 
          error ? "text-orange-500" : 
          "text-orange-500 group-focus-within:text-orange-400"
        }`} />
      </div>
      <input
        disabled={disabled}
        {...props}
        className={`
          w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all duration-300 text-base
          placeholder:text-zinc-600
          ${disabled 
            ? "bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed" 
            : error
              ? "bg-orange-900/10 border-orange-500/30 text-orange-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              : "bg-zinc-900 border-zinc-800 text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-zinc-700"
          }
        `}
      />
    </div>
  </div>
));

InputField.displayName = "InputField";

// ----------------------------------------------------------------------
// 2. CHECKOUT PAGE (RESTOBAR)
// ----------------------------------------------------------------------
export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    email: ""
  });

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      const names = user.name ? user.name.split(" ") : ["", ""];
      setFormData((prev) => ({
        ...prev,
        first_name: prev.first_name || names[0] || "",
        last_name: prev.last_name || names.slice(1).join(" ") || "",
        email: user.email || "",
        phone: prev.phone || (user as any).phone || "",
        address: prev.address || (user as any).address || ""
      }));
    }
  }, [user]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  }, []);

  const isFormValid = useMemo(() => {
    return (
      formData.first_name.trim().length > 1 &&
      formData.last_name.trim().length > 1 &&
      formData.address.trim().length > 5 &&
      formData.phone.trim().length >= 9 &&
      formData.email.includes("@")
    );
  }, [formData]);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);
  const delivery = subtotal >= 150 ? 0 : 10;
  const total = subtotal + delivery;

  // 🟢 Lógica WhatsApp Restobar
  const handleWhatsAppCheckout = () => {
    if (!isFormValid) return;

    const PHONE_NUMBER = "51932563713"; 

    let message = "*HOLA! 🍔 TENGO HAMBRE, QUIERO HACER UN PEDIDO* 🔥\n\n";
    
    message += `👤 *Cliente:* ${formData.first_name} ${formData.last_name}\n`;
    message += `📞 *Teléfono:* ${formData.phone}\n`;
    message += `📍 *Dirección:* ${formData.address}\n`;
    message += `📧 *Email:* ${formData.email}\n\n`;
    
    message += `📝 *MI ORDEN:*\n`;
    
    cart.forEach(item => {
      const itemTotal = (item.product.price * item.quantity).toFixed(2);
      message += `• ${item.quantity} x ${item.product.name} (S/ ${itemTotal})\n`;
    });

    message += `\n--------------------------\n`;
    message += `🚚 *Delivery:* ${delivery === 0 ? "GRATIS" : `S/ ${delivery.toFixed(2)}`}\n`;
    message += `💰 *TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n\n`;
    message += `💬 *Quedo a la espera de la confirmación.* 🚀`;

    clearCart();

    const url = `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    // 🔴 FIX: Relative + Overflow-x-hidden
    <div className="min-h-screen relative overflow-x-hidden font-sans pb-24 selection:bg-orange-500/30 text-white">
      
      {/* 🔴 FIX: Fondo en z-[-1] para no tapar el footer */}
      <div className="fixed inset-0 bg-[#0a0a0a] z-[-1]" />
      
      {/* Luces Ambientales Restobar (Naranja/Rojo) */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-orange-950/20 via-[#0a0a0a]/80 to-[#0a0a0a] pointer-events-none z-[-1]" />
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      
      <main className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-16 mt-6"
        >
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"/>
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Checkout Seguro</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3">
            Finalizar <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Pedido</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-lg mx-auto flex items-center justify-center gap-2">
            La cocina está lista. Completa tus datos. <UtensilsCrossed size={18} className="text-orange-500"/>
          </p>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* 📝 COLUMNA 1: FORMULARIO */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 order-1"
          >
            <div className="bg-zinc-950/50 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl shadow-orange-900/5 relative">
              
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white transform -rotate-3">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Datos de Entrega</h2>
                  <p className="text-sm text-zinc-500">¿A dónde enviamos la comida?</p>
                </div>
              </div>

              <div className="space-y-6">
                <InputField 
                  label="Correo Electrónico" 
                  name="email" 
                  type="email" 
                  icon={Mail} 
                  value={formData.email} 
                  onChange={handleChange}
                  disabled 
                  error={!formData.email && touchedFields.email ? "Requerido" : undefined}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    label="Nombre" 
                    name="first_name" 
                    type="text" 
                    icon={User}
                    value={formData.first_name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tu nombre" 
                    autoComplete="given-name"
                    error={!formData.first_name && touchedFields.first_name ? "Requerido" : undefined}
                  />
                  <InputField 
                    label="Apellido" 
                    name="last_name" 
                    type="text" 
                    icon={User}
                    value={formData.last_name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tus apellidos" 
                    autoComplete="family-name"
                    error={!formData.last_name && touchedFields.last_name ? "Requerido" : undefined}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    label="Celular" 
                    name="phone" 
                    type="tel"
                    inputMode="numeric"
                    icon={Phone}
                    value={formData.phone} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="999 999 999" 
                    autoComplete="tel"
                    error={formData.phone.length < 9 && touchedFields.phone ? "Inválido" : undefined}
                  />
                  <InputField 
                    label="Dirección de Entrega" 
                    name="address" 
                    type="text" 
                    icon={MapPin}
                    value={formData.address} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Calle, Número, Referencia..." 
                    autoComplete="street-address"
                    error={!formData.address && touchedFields.address ? "Requerido" : undefined}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 💰 COLUMNA 2: RESUMEN Y PAGO */}
          <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="lg:col-span-5 order-2"
          >
            <div className="sticky top-8">
              {/* Borde Naranja Fuego */}
              <div className="bg-gradient-to-b from-zinc-900 to-black p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                
                {/* Glow decorativo Naranja */}
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-50" />

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <ShoppingBag className="text-orange-500 w-5 h-5" />
                  <h2 className="text-lg font-bold tracking-wide uppercase text-zinc-200">Resumen</h2>
                </div>

                {/* Lista de Items */}
                <div className="max-h-60 overflow-y-auto pr-2 mb-8 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm py-3 border-b border-white/5 last:border-0 group-hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-orange-500 border border-white/5">
                            {item.quantity}
                          </div>
                          <span className="text-zinc-300 font-medium line-clamp-1">{item.product.name}</span>
                      </div>
                      <span className="text-white font-semibold">
                        S/ {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="space-y-3 py-6 border-t border-dashed border-white/10 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Costo de Envío</span>
                    <span className={delivery === 0 ? "text-green-400 font-bold bg-green-900/20 px-2 rounded" : ""}>
                      {delivery === 0 ? "GRATIS" : `S/ ${delivery.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end pb-8 border-b border-white/10 mb-8">
                  <div className="flex flex-col">
                    <span className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total a Pagar</span>
                    <span className="text-4xl font-black text-white tracking-tighter">
                      <span className="text-lg font-medium text-orange-500 mr-1">S/</span>
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 🚨 ZONA DE PAGO Y ACCIÓN */}
                <div className="relative z-20 space-y-5">
                    
                    {/* Mensaje de validación flotante */}
                    <AnimatePresence>
                      {!isFormValid && Object.keys(touchedFields).length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-xs text-orange-300 bg-orange-900/20 border border-orange-500/20 p-3 rounded-xl mb-2"
                        >
                           <AlertCircle className="w-4 h-4 text-orange-500 shrink-0"/>
                           <span>Completa los datos para ver las opciones de pago.</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* BOTÓN 1: CULQI */}
                    <div className={`transition-all duration-300 ${!isFormValid ? "opacity-40 pointer-events-none grayscale blur-[1px]" : "opacity-100"}`}>
                      <CheckoutCulqi 
                        total={total} 
                        userData={formData} 
                      />
                    </div>

                    {/* Separador */}
                    <div className="flex items-center gap-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">O Prefiere</span>
                      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                    </div>

                    {/* BOTÓN 2: WHATSAPP */}
                    <button
                      onClick={handleWhatsAppCheckout}
                      disabled={!isFormValid}
                      className={`
                        group relative w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden
                        ${!isFormValid 
                          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5" 
                          : "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-green-900/30 hover:scale-[1.02] active:scale-[0.98]"
                        }
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      
                      <MessageCircle className="w-6 h-6 fill-current" />
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-xs font-medium opacity-90">Atención Personalizada</span>
                        <span className="font-bold text-lg">Pagar por WhatsApp</span>
                      </div>
                      {isFormValid && <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
                    </button>
                  
                  {/* Footer Seguro */}
                  <div className="pt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    Pagos Encriptados & Seguros
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}