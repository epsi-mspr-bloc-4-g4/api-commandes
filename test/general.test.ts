import request from 'supertest';
import app from '../src/app';

describe('Order API endpoints integration tests', () => {
  it("POST /api/orders : should create a new order and return 201", async () => {
    const newOrder = {
      customerId: 1,
      products: [{ productId: 1, quantity: 2 }],
    };
    try {
      const response = await request(app)
        .post("/api/orders")
        .send(newOrder)
        .timeout(10000); // Increase timeout to 10 seconds
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
    } catch (error) {
      console.error("POST /api/orders failed:", error);
      throw error;
    }
  });
  
  it("GET /api/orders : should return 200 and an array of orders", async () => {
    try {
      const response = await request(app).get("/api/orders");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    } catch (error) {
      console.error("GET /api/orders failed:", error);
      throw error;
    }
  });

  it("DELETE /api/orders/:id : should return 200 at first, and 404 for the second time", async () => {
    try {
      const response = await request(app).get("/api/orders");
      const lastOrder = response.body[response.body.length - 1];

      if (!lastOrder || !lastOrder.id) {
        throw new Error("No valid order found to delete");
      }

      const response2 = await request(app).delete(`/api/orders/${lastOrder.id}`);
      expect(response2.statusCode).toBe(200);

      const response3 = await request(app).delete(`/api/orders/${lastOrder.id}`);
      expect(response3.statusCode).toBe(404); // 404 not found expected for the second delete
    } catch (error) {
      console.error("DELETE /api/orders/:id failed:", error);
      throw error;
    }
  });
});

// Ensure KafkaJS consumers and producers are disconnected after tests
afterAll(async () => {
  await consumer.disconnect();
  await producer.disconnect();
});
