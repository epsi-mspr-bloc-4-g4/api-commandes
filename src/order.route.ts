import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();
export const orderRouter = express.Router();

// orderRouter.post("/api/customers", async (req: Request, res: Response) => {
//   try {
//     const { name, company, username, firstName, lastName, address, profile } = req.body;
//     const newOrder = await prisma.order.create({
//       data: {
//         createdAt: new Date(),
//         company :{
//           create: {
//             name: name,
//           }
//         },
//         name,
//         username,
//         firstName,
//         lastName,
//         address: {
//           create: {
//             postalCode: address.postalCode,
//             city: address.city
//           }
//         },
//         profile: {
//           create: {
//             firstName: profile.firstName,
//             lastName: profile.lastName,
//           }
//         }
//       }
//     });
//     res.json(newCustomer);
//     } catch (error) {
//       res.status(500).json({ error: 'Something went wrong' });
//       console.log(error);
//     }
// });

// Get all orders
orderRouter.get("/api/orders", async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany();
    let result = {
      orders,
      // products: [],
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get a single customer
// orderRouter.get("/api/customers/:id", async (req: Request, res: Response) => {
//   try {
//     const customer = await prisma.customer.findUnique({
//       where: { id: Number(req.params.id) },
//     });
//     let result = {
//       customer: customer,
//       orders: [],
//     };
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// Update a customer
// orderRouter.put("/api/customers/:id", async (req: Request, res: Response) => {
//   try {
//     const customer = await prisma.customer.update({
//       where: { id: Number(req.params.id) },
//       data: req.body,
//     });
//     res.json(customer);
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// Delete a customer
// orderRouter.delete(
//   "/api/customers/:id",
//   async (req: Request, res: Response) => {
//     try {
//       const customer = await prisma.customer.delete({
//         where: { id: Number(req.params.id) },
//       });
//       res.json(
//         "Votre compte a été supprimé avec succès " +
//           customer.firstName +
//           " " +
//           customer.lastName +
//           " !"
//       );
//     } catch (error) {
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   }
// );

// Get orders of a specific customer
// orderRouter.get(
//   "/api/customers/:customerId/orders",
//   async (req: Request, res: Response) => {
//     try {
//       const orders = [];
//       //await prisma.order.findMany({
//       //   where: { customerId: Number(req.params.customerId) },
//       //   include: { product: true },
//       // });
//       res.json("orders");
//     } catch (error) {
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   }
// );

// Get a specific order of a specific customer
// orderRouter.get(
//   "/api/customers/:customerId/orders/:orderId",
//   async (req: Request, res: Response) => {
//     try {
//       const order = []; // await prisma.order.findUnique({
//       //   where: { id: Number(req.params.orderId) },
//       //   include: { product: true },
//       // });
//       //if (order && order.customerId === Number(req.params.customerId)) {
//       res.json("order");
//       // } else {
//       //   res.status(404).json({ error: 'Order not found' });
//       // }
//     } catch (error) {
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   }
// );

// Get products of a specific order of a specific customer
// orderRouter.get(
//   "/api/customers/:customerId/orders/:orderId/products",
//   async (req: Request, res: Response) => {
//     try {
//       const order = []; //await prisma.order.findUnique({
//       //   where: { id: Number(req.params.orderId) },
//       //   include: { product: true },
//       // });
//       // if (order && order.customerId === Number(req.params.customerId)) {
//       //res.json(order.product);
//       // } else {
//       //   res.status(404).json({ error: 'Order not found' });
//       // }
//     } catch (error) {
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   }
// );

export default orderRouter;
