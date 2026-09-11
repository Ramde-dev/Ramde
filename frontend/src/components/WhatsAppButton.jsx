export default function WhatsAppButton() {
    // Namba yako ya WhatsApp (bila 0 mwanzoni, na country code ya Tanzania +255)
    const phoneNumber = '255785898551';
    
    // Ujumbe wa default (unaonekana tayari kwenye chat)
    const message = 'Habari Ramadhani! Naona portfolio yako, ningependa kuwasiliana nawe.';
    
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-cta-btn"
            aria-label="Chat on WhatsApp"
        >
            {/* Tooltip inaonekana wakati wa hover */}
            <span className="wa-cta-tooltip">💬 Chat nami WhatsApp</span>
            
            {/* Icon */}
            <i className="fa-brands fa-whatsapp"></i>
            
            {/* Label (inaonekana kwenye desktop) */}
            <span className="wa-cta-label">WhatsApp</span>
        </a>
    );
}