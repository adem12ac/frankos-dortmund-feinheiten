import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/491741696161?text=Hallo%20Frankos%2C%20ich%20habe%20eine%20Frage%20zu%20Ihren%20Produkten."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat auf WhatsApp starten"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-105 hover:brightness-110 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}