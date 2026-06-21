export function buildWhatsAppUrl({ productName, price, size, quantity }: { productName: string; price: number; size: string; quantity: number }) {
    const base = 'https://wa.me/9779845465529?text=';
    const message = `Hello NINE77,%0A%0AI would like to order:%0A%0AProduct: ${productName}%0APrice: Rs. ${price}%0ASize: ${size}%0AQuantity: ${quantity}%0A%0ACustomer Name:%0APhone Number:%0AAddress:%0A%0AThank You.`;
    return `${base}${encodeURIComponent(message)}`;
}
