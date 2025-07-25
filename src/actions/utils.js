import Cookies from 'js-cookie';
let lang = Cookies.get('lang') ? Cookies.get('lang') : "AR";
import en from "../../locales/en.json";
import ar from "../../locales/ar.json";

// Function to update the cart
export function addToCart(newItem) {
    const requestedQty = parseInt(newItem.qty);
    const availableQty = parseInt(newItem.avlqty);
        console.log(newItem);


    // Step 1: Get cart from cookie or initialize as empty array
    let cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];

    // Step 2: Check if item already exists in the cart
    const existingItem = cart.find(obj => obj.item === newItem.item);

    if (existingItem) {
        const currentQty = parseInt(existingItem.qty);
        const totalQty = currentQty + requestedQty;

        // Step 3: Check if total quantity exceeds available
        if (totalQty > availableQty) {
            return {
                success: false,
                message: lang === "EN"
                    ? `Only ${availableQty} item(s) are available in total. You already have ${currentQty} in the cart.`
                    : `متوفر فقط ${availableQty} قطعة من هذا المنتج. لديك بالفعل ${currentQty} في السلة.`
            };
        }

        // Step 4: Update quantity in cart
        existingItem.qty = totalQty.toString();
    } else {
        // Step 5: Check if requested qty alone exceeds available
        if (requestedQty > availableQty) {
            return {
                success: false,
                message: lang === "EN"
                    ? `Only ${availableQty} item(s) are available in total.`
                    : `متوفر فقط ${availableQty} قطعة من هذا المنتج.`
            };
        }

        // Step 6: Add new item to cart
        
        cart.push({
            id: newItem.id,
            item: newItem.item,
            qty: newItem.qty.toString(),
            avlqty: newItem.avlqty.toString(),
            name: newItem.name,
            price: newItem.price,
            image: newItem.image
        });
    }

    // Step 7: Save updated cart to cookie (7-day expiry)
    Cookies.set('cart', JSON.stringify(cart), { expires: 7, path: '/' });

    return {
        success: true,
        message: lang === "EN"
            ? "Item added to cart."
            : "تمت إضافة المنتج إلى السلة."
    };
}

// Function to get cart from cookie
export function getCart() {
    return Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
}

// Function to get profile from cookie
export function getProfile() {
    return Cookies.get('profile') ? JSON.parse(Cookies.get('profile')) : [];
}
// Function to get lang from cookie
export function getLang() {
    return Cookies.get('lang') ? Cookies.get('lang') : [];
}

export function logout() {
    Cookies.remove('profile');
    Cookies.remove("legoToken");
    Cookies.remove('cart');
    window.location.href = '/';
}

export function brokenImage() {
    const image = "data:image/png;base64,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"
    return image
}