import { CAFE_PHONE } from '../data/products'

export default function WhatsAppButton() {
  const digits = CAFE_PHONE.replace(/\D/g, '')
  const waNumber = digits.startsWith('0') ? `63${digits.slice(1)}` : digits
  const message = encodeURIComponent("Hi Knet's Brew! I'd like to inquire about your coffee menu.")

  return (
    <a
      href={`https://wa.me/${waNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_24px_rgba(37,211,102,0.4)] transition duration-300 hover:scale-110 hover:shadow-[0_6px_32px_rgba(37,211,102,0.55)] active:scale-95"
    >
      <i className="fa-brands fa-whatsapp text-2xl" />
    </a>
  )
}
