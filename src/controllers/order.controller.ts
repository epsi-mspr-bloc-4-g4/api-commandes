import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { fetchProductsForOrder, produceMessage } from '../../kafka/producer';
import { consumeMessages } from "../../kafka/consumer";

const prisma = new PrismaClient();

// Création d'une nouvelle commande
let consumerInitialized = false;

export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!consumerInitialized) {
      await consumeMessages("order-products-fetch");
      consumerInitialized = true;
    }

    const { orderProducts, customerId } = req.body;
    const newOrder = await prisma.order.create({
      data: {
        createdAt: new Date(),
        customerId,
        orderProducts,
      },
    });

    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

// Récupération de toutes les commandes
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderProducts: true,
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Récupération d'une seule commande
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        customerId: true,
        orderProducts: true,
      },
    });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Mise à jour d'une commande
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Suppression d'une commande
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.delete({
      where: { id: Number(req.params.id) },
    });
    res.json(`Order ${order.id} has been successfully deleted!`);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Récupération des produits d'une commande
let messages: any[] = []; // Array to store consumed messages

export const getOrderProducts = async (req: Request, res: Response) => {
  try {
    const { orderId, id } = req.params;

    await fetchProductsForOrder(orderId);

    if (!consumerInitialized) {
      messages = await consumeMessages("order-products-response");
      consumerInitialized = true;
    }

    // Parse messages to JSON
    const products = messages.map(message => JSON.parse(message.value));

    if (id) {
      // If a specific product ID is provided, find that product
      const product = products.find(product => product.id === id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } else {
      // Otherwise, return all products for the order
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};
