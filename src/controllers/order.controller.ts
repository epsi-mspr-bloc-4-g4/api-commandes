import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { fetchProductsForOrder, produceMessage } from "../../kafka/producer";
import { consumeMessages } from "../../kafka/consumer";

const prisma = new PrismaClient();

type InputOrder = {
  customerId: number;
  orderedProductsName: string[];
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const messages = await consumeMessages("order-products-fetch");

    const latestProducts = JSON.parse(messages[messages.length - 1].value);

    const { orderedProductsName, customerId }: InputOrder = req.body;

    const filteredProducts = latestProducts.filter((product: any) =>
      orderedProductsName.includes(product.name)
    );

    const newOrder = await prisma.order.create({
      data: {
        createdAt: new Date(),
        customerId,
      },
    });

    const orderProducts = filteredProducts.map(async (product: any) => {
      await prisma.orderProduct.create({
        data: {
          productId: product.id,
          order: {
            connect: {
              id: newOrder.id,
            },
          },
        },
      });
    });

    res.json(
      "Votre commande avec l'id " +
        newOrder.id +
        " a bien été créé. " +
        filteredProducts.map((product: any) => product.name)
    );
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

// Récupération de toutes les commandes
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const messages = await consumeMessages("order-products-fetch");

    const latestProducts = JSON.parse(messages[messages.length - 1].value);

    const orderProducts = await prisma.orderProduct.findMany();

    let orders: any[] = [];
    orderProducts.map(async (orderProduct: any) => {
      const product = latestProducts.find(
        (product: any) => product.id === orderProduct.productId
      );

      orders.push({
        orderId: orderProduct.orderId,
        createdAt: product.createdAt,
        id: product.id,
        name: product.name,
        details: {
          price: product.details.price,
          description: product.details.description,
          color: product.details.color,
        },
        stock: product.stock,
      });
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong : " + error });
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

export const getOrderProducts = async (req: Request, res: Response) => {
  try {
    const messages = await consumeMessages("order-products-fetch");

    const latestProducts = JSON.parse(messages[messages.length - 1].value);

    const orderProducts = await prisma.orderProduct.findMany({
      where: {
        orderId: Number(req.params.id),
      },
    });

    let orders: any[] = [];
    orderProducts.map(async (orderProduct: any) => {
      const product = latestProducts.find(
        (product: any) => product.id === orderProduct.productId
      );

      orders.push({
        orderId: orderProduct.orderId,
        createdAt: product.createdAt,
        id: product.id,
        name: product.name,
        details: {
          price: product.details.price,
          description: product.details.description,
          color: product.details.color,
        },
        stock: product.stock,
      });
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong : " + error });
  }
};

export const updateOrderProducts = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;

    const messages = await consumeMessages("order-products-fetch");

    const latestProducts = JSON.parse(messages[messages.length - 1].value);

    const { orderedProductsName }: InputOrder = req.body;

    const filteredProducts = latestProducts.filter((product: any) =>
      orderedProductsName.includes(product.name)
    );

    await prisma.orderProduct.deleteMany({
      where: {
        orderId: Number(orderId),
      },
    }),
      filteredProducts.map(async (product: any) => {
        await prisma.orderProduct.create({
          data: {
            orderId: Number(orderId),
            productId: product.id,
          },
        });
      }),
      res.json(
        "Les produits de la commande avec l'id " +
          req.params.id +
          " ont bien été mis à jour. " +
          filteredProducts.map((product: any) => product.name)
      );
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
};

export const deleteOrderProduct = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const { orderedProductsName } = req.body;

    const messages = await consumeMessages("order-products-fetch");

    const latestProducts = JSON.parse(messages[messages.length - 1].value);

    const filteredProducts = latestProducts.filter((product: any) =>
      orderedProductsName.includes(product.name)
    );

    filteredProducts.map(async (product: any) => {
      await prisma.orderProduct.delete({
        where: {
          orderId_productId: {
            orderId: Number(orderId),
            productId: product.id,
          },
        },
      });
    });

    res.json(
      `Le produit avec l'id ${filteredProducts.map(
        (product: any) => product.id
      )} de la commande avec l'id ${orderId} a bien été supprimé`
    );
  } catch (error) {
    res.status(500).json({ error: "Something went wrong : " + error });
  }
};

export const getOrderProductByProductId = async (
  req: Request,
  res: Response
) => {
  try {
    const messages = await consumeMessages("order-products-fetch");

    const { orderId, productId } = req.params;

    const latestProducts = JSON.parse(messages[messages.length - 1].value);

    const orderProducts = await prisma.orderProduct.findMany({
      where: {
        orderId: Number(orderId),
        productId: Number(productId),
      },
    });

    let orders: any[] = [];
    if (!orderProducts) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    orderProducts.map(async (orderProduct: any) => {
      const product = latestProducts.find(
        (product: any) => product.id === orderProduct.productId
      );

      orders.push({
        orderId: orderProduct.orderId,
        createdAt: product.createdAt,
        id: product.id,
        name: product.name,
        details: {
          price: product.details.price,
          description: product.details.description,
          color: product.details.color,
        },
        stock: product.stock,
      });
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong : " + error });
  }
};
