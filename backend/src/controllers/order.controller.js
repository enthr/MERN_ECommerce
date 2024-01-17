import Order from "../models/order.schema.js";
import Product from "../models/product.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customError.js";
import { calculatePrices } from "../utils/calculatePrices.js";
import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";

/******************************************************
 * @CREATE_ORDER
 * @route [Server_URL]/api/order/create
 * @description Order Create Controller for Creating New Order
 * @returns Order Object
 * @access Private
 ******************************************************/
export const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0 || !shippingAddress || !paymentMethod) {
        throw new customError("Please Enter All Order Details", 400);
    }

    const dbItems = await Product.find({ _id: { $in: orderItems.map((x) => x.product) } });

    if (!dbItems || dbItems.length === 0) {
        throw new customError("No Products Found", 404);
    }

    const dbOrderItems = orderItems.map((orderItem) => {
        const mathcingItem = dbItems.find((item) => item._id.toString() === orderItem.product);

        if (!mathcingItem) {
            throw new customError(`Product ${orderItem._id} Not Found`, 404);
        }

        return {
            product: orderItem.product,
            qty: orderItem.qty,
            price: mathcingItem.price
        };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calculatePrices(dbOrderItems);

    const order = await Order.create({
        user: req.user._id,
        orderItems: dbOrderItems,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice,
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice
    });

    if (!order) {
        throw new customError("Order Creation Failed", 500);
    }

    res.status(200).json({
        success: true,
        order: order
    });
});

/**********************************************************
 * @GET_USER_ORDERS
 * @route [Server_URL]/api/order/user
 * @description Order Get All Controller for Getting All Orders of Logged In User
 * @returns All Orders of Logged In User
 * @access Private
 **********************************************************/
export const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders || orders.length === 0) {
        throw new customError("No Orders Found", 404);
    }

    res.status(200).json({
        success: true,
        orders: orders
    });
});

/**********************************************************
 * @GET_USER_ORDER_BY_ID
 * @route [Server_URL]/api/order/:orderId
 * @description Order Get By Id Controller for Getting Order By Id of Logged In User
 * @returns Order Details of Given Id Logged In User
 * @access Private
 **********************************************************/
export const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("user", "name email").populate("orderItems.product", "name image");

    if (!order) {
        throw new customError("Order Not Found", 404);
    }

    res.status(200).json({
        success: true,
        order: order
    });
});

/**********************************************************
 * @GET_All_ORDERS
 * @route [Server_URL]/api/order/all
 * @description Order Get All Controller for Getting All Orders
 * @returns All Orders
 * @access Admin
 **********************************************************/
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "name email");

    if (!orders || orders.length === 0) {
        throw new customError("No Orders Found", 404);
    }

    res.status(200).json({
        success: true,
        orders: orders
    });
});

/**********************************************************
 * @UPDATE_ORDER_TO_PAID
 * @route [Server_URL]/api/order/paid/:orderId
 * @description Order Update To Delivered Controller for Updating Order To Delivered
 * @returns Updated Order
 * @access Private
 **********************************************************/
export const updateOrderToPaidById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const { verified, value } = await verifyPayPalPayment(req.body.id);
    if (!verified) throw new Error('Payment Not Verified');

    const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
    if (!isNewTransaction) throw new Error('Transaction has been used before');

    const order = await Order.findById(orderId);

    if (!order) {
        throw new customError("Order Not Found", 404);
    }
    
    const paidCorrectAmount = order.totalPrice === parseInt(value);
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();

    res.status(200).json({
        success: true,
        order: updatedOrder
    });
});

/**********************************************************
 * @UPDATE_ORDER_TO_DELIVERED
 * @route [Server_URL]/api/order/delivered/:orderId
 * @description Order Update To Delivered Controller for Updating Order To Delivered
 * @returns Updated Order
 * @access Admin
 **********************************************************/
export const updateOrderToDeliveredById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { isDelivered: true, deliveredAt: Date.now() }, { new: true, runValidators: true });

    if (!updatedOrder) {
        throw new customError("Order Not Found", 404);
    }

    res.status(200).json({
        success: true,
        order: updatedOrder
    });
});