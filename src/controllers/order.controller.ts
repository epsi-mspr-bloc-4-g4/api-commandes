import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Création d'une nouvelle commande
export const createOrder = async (req: Request, res: Response) => {
    try {
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

/* 

À IMPLEMENTER 

/orders/1/products/ = Products de l’Order 1
/orders/1/products/51 = Product 51 de l’Order 1

*/