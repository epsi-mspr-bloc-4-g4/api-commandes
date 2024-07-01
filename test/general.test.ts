import { consumeMessages } from "../src/kafka/consumer";
import request from "supertest";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";

jest.mock("../src/kafka/consumer");

const prisma = new PrismaClient();

describe("API Tests", () => {
  const newOrder = {
    customerId: 99999999,
    orderedProductsName: ["Kenya AA"],
  };

  beforeEach(async () => {
    await request(app).post("/api/orders").send(newOrder);
  });

  afterEach(async () => {
    const lastOrder = await prisma.order.findFirst({
      where: {
        customerId: 99999999,
      },
    });
    if (!lastOrder) return;
    await prisma.order.delete({
      where: {
        id: lastOrder.id,
      },
    });
  });

  it("POST /api/orders/ : should return 200", async () => {
    (consumeMessages as jest.Mock).mockResolvedValue([
      {
        value: JSON.stringify([
          {
            id: 1,
            createdAt: "2024-06-29T21:23:57.836Z",
            name: "Guatemalan Antigua",
            stock: 200,
            detailId: 2,
            details: {
              id: 2,
              price: "19",
              description: "Rich flavor with a hint of cocoa and spice",
              color: "medium brown",
            },
          },
          {
            id: 2,
            createdAt: "2024-06-29T21:23:57.837Z",
            name: "Tanzanian Peaberry",
            stock: 80,
            detailId: 3,
            details: {
              id: 3,
              price: "23",
              description: "Bright and lively with a citrusy flavor",
              color: "medium brown",
            },
          },
        ]),
      },
    ]);

    const fackCustomerId = Number(Math.floor(Math.random() * 1000000000));
    const newOrder = {
      customerId: fackCustomerId,
      orderedProductsName: ["Kenya AA"],
    };
    const response = await request(app).post("/api/orders").send(newOrder);

    const lastOrder = await prisma.order.findFirst({
      where: {
        customerId: fackCustomerId,
      },
    });

    if (!lastOrder) return;
    expect(response.body).toEqual(
      `Votre commande avec l'id ${lastOrder.id} a bien été créé. `
    );
  });

  it("GET /api/orders : should return 200", async () => {
    (consumeMessages as jest.Mock).mockResolvedValue([
      {
        value: JSON.stringify([
          {
            id: 1,
            createdAt: "2024-06-29T21:23:57.836Z",
            name: "Guatemalan Antigua",
            stock: 200,
            detailId: 2,
            details: {
              id: 2,
              price: "19",
              description: "Rich flavor with a hint of cocoa and spice",
              color: "medium brown",
            },
          },
          {
            id: 2,
            createdAt: "2024-06-29T21:23:57.837Z",
            name: "Tanzanian Peaberry",
            stock: 80,
            detailId: 3,
            details: {
              id: 3,
              price: "23",
              description: "Bright and lively with a citrusy flavor",
              color: "medium brown",
            },
          },
        ]),
      },
    ]);

    const response = await request(app).get("/api/orders");

    expect(response.statusCode).toBe(200);
  });

  it("GET /api/orders/:id : should return 200", async () => {
    (consumeMessages as jest.Mock).mockResolvedValue([
      {
        value: JSON.stringify([
          {
            id: 1,
            createdAt: "2024-06-29T21:23:57.836Z",
            name: "Guatemalan Antigua",
            stock: 200,
            detailId: 2,
            details: {
              id: 2,
              price: "19",
              description: "Rich flavor with a hint of cocoa and spice",
              color: "medium brown",
            },
          },
          {
            id: 2,
            createdAt: "2024-06-29T21:23:57.837Z",
            name: "Tanzanian Peaberry",
            stock: 80,
            detailId: 3,
            details: {
              id: 3,
              price: "23",
              description: "Bright and lively with a citrusy flavor",
              color: "medium brown",
            },
          },
        ]),
      },
    ]);
    const lastOrder = await prisma.order.findFirst({
      where: {
        customerId: 99999999,
      },
    });

    if (!lastOrder) return;
    const response2 = await request(app).get(`/api/orders/${lastOrder?.id}`);

    expect(response2.statusCode).toBe(200);
    expect(response2.body).toHaveProperty("customerId", lastOrder.customerId);
  });

  it("DELETE /api/orders/:id : should return the Order Id that has been deleted", async () => {
    (consumeMessages as jest.Mock).mockResolvedValue([
      {
        value: JSON.stringify([
          {
            id: 1,
            createdAt: "2024-06-29T21:23:57.836Z",
            name: "Guatemalan Antigua",
            stock: 200,
            detailId: 2,
            details: {
              id: 2,
              price: "19",
              description: "Rich flavor with a hint of cocoa and spice",
              color: "medium brown",
            },
          },
          {
            id: 2,
            createdAt: "2024-06-29T21:23:57.837Z",
            name: "Tanzanian Peaberry",
            stock: 80,
            detailId: 3,
            details: {
              id: 3,
              price: "23",
              description: "Bright and lively with a citrusy flavor",
              color: "medium brown",
            },
          },
        ]),
      },
    ]);

    const lastOrder = await prisma.order.findFirst({
      where: {
        customerId: 99999999,
      },
    });

    if (!lastOrder) return;

    const response2 = await request(app).delete(`/api/orders/${lastOrder?.id}`);

    expect(response2.body).toEqual(
      `Order ${lastOrder.id} has been successfully deleted!`
    );
  });

  it("PUT /api/orders/:id : should return 200", async () => {
    (consumeMessages as jest.Mock).mockResolvedValue([
      {
        value: JSON.stringify([
          {
            id: 1,
            createdAt: "2024-06-29T21:23:57.836Z",
            name: "Guatemalan Antigua",
            stock: 200,
            detailId: 2,
            details: {
              id: 2,
              price: "19",
              description: "Rich flavor with a hint of cocoa and spice",
              color: "medium brown",
            },
          },
          {
            id: 2,
            createdAt: "2024-06-29T21:23:57.837Z",
            name: "Tanzanian Peaberry",
            stock: 80,
            detailId: 3,
            details: {
              id: 3,
              price: "23",
              description: "Bright and lively with a citrusy flavor",
              color: "medium brown",
            },
          },
        ]),
      },
    ]);
    const lastOrder = await prisma.order.findFirst({
      where: {
        OR: [{ customerId: 99999999 }, { customerId: 99999998 }],
      },
    });

    if (!lastOrder) return;
    const response = await request(app)
      .put(`/api/orders/${lastOrder.id}`)
      .send({
        customerId: 99999998,
      });

    expect(response.statusCode).toBe(200);

    const response3 = await request(app).get(`/api/orders/${lastOrder.id}`);
    expect(response3.body).toHaveProperty("customerId", 99999998);
  });
});
