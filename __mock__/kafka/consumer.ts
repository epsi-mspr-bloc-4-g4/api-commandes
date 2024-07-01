const mockMessages = [
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
];

export const consumeMessages = jest.fn().mockResolvedValue(mockMessages);
