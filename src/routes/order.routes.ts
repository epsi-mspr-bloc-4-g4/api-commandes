import express from "express";
import * as orderController from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/api/orders", orderController.createOrder);
orderRouter.get("/api/orders", orderController.getAllOrders);
orderRouter.get("/api/orders/:id", orderController.getOrderById);
orderRouter.put("/api/orders/:id", orderController.updateOrder);
orderRouter.delete("/api/orders/:id", orderController.deleteOrder);
orderRouter.get("/api/orders/:id/products", orderController.getOrderProducts);
orderRouter.put(
  "/api/orders/:id/products",
  orderController.updateOrderProducts
);
orderRouter.delete(
  "/api/orders/:id/products",
  orderController.deleteOrderProduct
);
orderRouter.get(
  "/api/orders/:orderId/products/:productId",
  orderController.getOrderProductByProductId
);

export default orderRouter;
