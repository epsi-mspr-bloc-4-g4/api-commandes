import request from 'supertest';
const baseURL = 'http://localhost:7000';

describe('Order API endpoints integration tests', () => {
  it("GET /api/orders : should return 200 and an array of orders", async () => {
    const response = await request(baseURL).get("/api/orders");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("POST /api/orders : should create a new order and return 201", async () => {
    const newOrder = {
      customerId: 1, // Adjust this to match your schema requirements
      products: [{ productId: 1, quantity: 2 }], // Example, adjust as needed
    };
    const response = await request(baseURL).post("/api/orders").send(newOrder);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("DELETE /api/orders/:id : should return 200 at first, and 404 for the second time", async () => {
    const response = await request(baseURL).get("/api/orders");
    const lastOrder = response.body[response.body.length - 1];

    const response2 = await request(baseURL).delete(`/api/orders/${lastOrder.id}`);
    expect(response2.statusCode).toBe(200);

    const response3 = await request(baseURL).delete(`/api/orders/${lastOrder.id}`);
    expect(response3.statusCode).toBe(404); // Assuming a 404 Not Found is more appropriate for a second deletion attempt
  });
});