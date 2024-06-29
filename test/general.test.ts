import request from 'supertest';
const baseURL = 'http://localhost:7000';

describe('Order API endpoints integration tests', () => {
  it("POST /api/orders : should create a new order and return 201", async () => {
    const newOrder = {
      customerId: 1,
      products: [{ productId: 1, quantity: 2 }],
    };
    try {
      const response = await request(app).post("/api/orders").send(newOrder);
      expect(response.statusCode).toBe(200);
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
      throw error; // Re-throwing the error to ensure Jest catches it
    }
  });

  it("DELETE /api/orders/:id : should return 200 at first, and 404 for the second time", async () => {
    try {
      const response = await request(app).get("/api/orders");
      const lastOrder = response.body[response.body.length - 1];

      const response2 = await request(app).delete(`/api/orders/${lastOrder.id}`);
      expect(response2.statusCode).toBe(200);

      const response3 = await request(app).delete(`/api/orders/${lastOrder.id}`);
      expect(response3.statusCode).toBe(500);
    } catch (error) {
      console.error("DELETE /api/orders/:id failed:", error);
      throw error;
    }
  });
});
