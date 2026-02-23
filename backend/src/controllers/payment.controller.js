import Stripe from "stripe";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
    try {
        const { cartItems, shippingAddress } = req.body;
        const user = req.user;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        let subtotal = 0;
        const validatedItems = [];

        for (const item of cartItems) {
            const product = await Product.findById(item.product._id);

            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for ${product.name}`,
                });
            }

            subtotal += product.price * item.quantity;

            validatedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0],
            });
        }

        const shipping = 10.0;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        if (total <= 0) {
            return res.status(400).json({ error: "Invalid order total" });
        }

        // ✅ 1️⃣ Create Order BEFORE Stripe
        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems: validatedItems,
            shippingAddress,
            subtotal,
            shipping,
            tax,
            totalPrice: total,
            status: "pending",
        });

        // ✅ 2️⃣ Find or create Stripe customer
        let customer;

        if (user.stripeCustomerId) {
            customer = await stripe.customers.retrieve(user.stripeCustomerId);
        } else {
            customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
            });

            await User.findByIdAndUpdate(user._id, {
                stripeCustomerId: customer.id,
            });
        }

        // ✅ 3️⃣ Create PaymentIntent (metadata SMALL)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "usd",
            customer: customer.id,
            automatic_payment_methods: { enabled: true },
            metadata: {
                orderId: order._id.toString(),
                userId: user._id.toString(),
            },
        });

        // Save paymentIntentId
        order.paymentResult = {
            id: paymentIntent.id,
            status: "pending",
        };

        await order.save();

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: "Failed to create payment intent" });
    }
}

export async function handleWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            ENV.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const { orderId } = paymentIntent.metadata;

        try {
            const order = await Order.findById(orderId);

            if (!order) {
                console.error("Order not found:", orderId);
                return res.json({ received: true });
            }

            // Prevent double processing
            if (order.status === "paid") {
                return res.json({ received: true });
            }

            order.status = "paid";
            order.paymentResult = {
                id: paymentIntent.id,
                status: "succeeded",
            };

            await order.save();

            // ✅ Decrease stock
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity },
                });
            }

            // ✅ Clear user cart
            await Cart.findOneAndDelete({ user: order.user });

            console.log("Order marked as paid:", order._id);

        } catch (error) {
            console.error("Webhook processing error:", error);
        }
    }

    res.json({ received: true });
}