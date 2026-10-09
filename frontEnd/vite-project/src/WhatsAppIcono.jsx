import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import React from 'react';

export default function WhatsAppIcono() {
  return (
    <a
      href="https://wa.me/+59892212572"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-[#25D366] text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
    >
      <WhatsAppIcon fontSize="medium" />
    </a>
  );
}
