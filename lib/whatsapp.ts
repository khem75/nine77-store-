export interface WhatsAppOrderOptions {
    productName: string;
    price: number;
    size: string;
    quantity: number;
}

export const buildWhatsAppUrl = ({
    productName,
    price,
    size,
    quantity,
}: WhatsAppOrderOptions): string => {
    const message = `🖤 NINE77 ORDER REQUEST

━━━━━━━━━━━━━━━
PRODUCT DETAILS
━━━━━━━━━━━━━━━

📦 Product: ${productName}
💰 Price: Rs. ${price}
📏 Size: ${size}
🔢 Quantity: ${quantity}

━━━━━━━━━━━━━━━
CUSTOMER DETAILS
━━━━━━━━━━━━━━━

👤 Name:
📱 Phone Number:
📍 Address:

━━━━━━━━━━━━━━━

Please confirm availability and delivery details.

Thank you,
NINE77 Customer`;

    return `https://wa.me/9779845465529?text=${encodeURIComponent(
        message
    )}`;
};