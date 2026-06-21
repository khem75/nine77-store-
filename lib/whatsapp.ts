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
    const message = `Hello NINE77,

I would like to place an order.

Product: ${productName}
Price: Rs. ${price.toLocaleString()}
Size: ${size}
Quantity: ${quantity}

Customer Name:
Phone Number:
Delivery Address:

Please confirm availability and delivery details.

Thank you.`;

    return `https://wa.me/9779810605409?text=${encodeURIComponent(
        message
    )}`;
};