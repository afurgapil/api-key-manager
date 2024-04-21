const request = require("supertest");
const server = require("../server");
const pool = require("../../utils/settings/usePool");
const checkIndexExists = require("../../utils/basicQueries/checkIndexExists");
const verifyToken = require("../../middlewares/verifyToken");
jest.mock("../../utils/settings/usePool");
jest.mock("../../utils/basicQueries/checkIndexExists");
jest.mock("../../middlewares/verifyToken");

describe("TC-022", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it("1-Should return all logs", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "00192e95-8ed7-43d2-a871-cd1cc69f2021";
    const mockResults = [
      {
        id: 32,
        user_id: userId,
        path_id: "4cffb935-5190-4d7d-867c-31ecfd038603",
        error_msg: "Path error.",
        company: "ABC Company",
        type: "404",
        timestamp: "2024-03-25T14:22:43.000Z",
      },
    ];
    const mockConnection = {
      query: jest.fn((sql, params, callback) => {
        expect(params).toEqual([userId]);
        callback(null, mockResults);
      }),
      release: jest.fn(),
    };

    pool.getConnection.mockImplementation((callback) =>
      callback(null, mockConnection)
    );

    const response = await request(server).get(`/log/get-all/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: mockResults });
    expect(mockConnection.release).toHaveBeenCalled();
  });

  it("2-Should return 400 if invalid userId is provided", async () => {
    checkIndexExists.mockResolvedValueOnce(false);
    const response = await request(server).get("/log/get-all/invalid-user-id");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User not found." });
  });

  it("3-Should handle database connection errors", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const userId = "00192e95-8ed7-43d2-a871-cd1cc69f2021";
    pool.getConnection.mockImplementation((cb) =>
      cb(new Error("Connection failed"))
    );
    const response = await request(server).get(`/log/get-all/${userId}`);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Database connection failed." });
  });

  it("4-Should handle SQL query errors", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const mockConnection = {
      query: jest.fn((sql, params, callback) =>
        callback(new Error("Query failed"), null)
      ),
      release: jest.fn(),
    };
    pool.getConnection.mockImplementation((callback) =>
      callback(null, mockConnection)
    );

    const response = await request(server).get(
      "/log/get-all/00192e95-8ed7-43d2-a871-cd1cc69f2021"
    );
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error retrieving error logs." });
    expect(mockConnection.release).toHaveBeenCalled();
  });

  it("5-Should return 404 if no logs are found for the user", async () => {
    checkIndexExists.mockResolvedValueOnce(true);
    const mockConnection = {
      query: jest.fn((sql, params, callback) => callback(null, [])),
      release: jest.fn(),
    };
    pool.getConnection.mockImplementation((callback) =>
      callback(null, mockConnection)
    );

    const response = await request(server).get(
      "/log/get-all/00192e95-8ed7-43d2-a871-cd1cc69f2021"
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "No error logs found.",
    });
    expect(mockConnection.release).toHaveBeenCalled();
  });
});

describe("TC-023", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it("1-Should delete log if both logId and userId exist", async () => {
    const logId = "123";
    const userId = "456";

    checkIndexExists.mockImplementation((tableName, index) => {
      if (tableName === "error_logs" && index === logId) {
        return Promise.resolve(true);
      } else if (tableName === "user" && index === userId) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    });
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: userId };
      next();
    });
    const response = await request(server)
      .delete(`/log/delete`)
      .send({ logId, userId });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Error logs deleted successfully.",
    });
  });

  it("2-Should return 404 if log or user is not found", async () => {
    const requiredFields = [`Log`, `User`];
    const logId = "123";
    const userId = "456";
    for (const field of requiredFields) {
      const mockReqBody = {
        logId,
        userId,
      };
      checkIndexExists.mockImplementation((tableName, index) => {
        if (tableName === "error_logs" && index === logId && field === "Log") {
          return Promise.resolve(false);
        } else if (
          tableName === "user" &&
          index === userId &&
          field === "User"
        ) {
          return Promise.resolve(false);
        } else {
          return Promise.resolve(true);
        }
      });
      verifyToken.mockImplementation((req, res, next) => {
        req.user = { id: userId };
        next();
      });
      const response = await request(server)
        .delete(`/log/delete`)
        .send(mockReqBody);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: `${field} not found.` });
    }
  });

  it("3-Should return 400 if logId or userId is missing", async () => {
    const requiredFields = ["logId", "userId"];
    const logId = "123";
    const userId = "456";

    for (const field of requiredFields) {
      const mockReqBody = {
        logId,
        userId,
      };
      checkIndexExists.mockImplementation((tableName, index) => {
        if (tableName === "error_logs" && index === logId) {
          return Promise.resolve(true);
        } else if (tableName === "user" && index === userId) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
      verifyToken.mockImplementation((req, res, next) => {
        req.user = { id: userId };
        next();
      });
      delete mockReqBody[field];
      const response = await request(server)
        .delete(`/log/delete`)
        .send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid paramater." });
    }
  });

  it("4-Should handle database connection errors", async () => {
    const logId = "123";
    const userId = "456";
    checkIndexExists.mockImplementation((tableName, index) => {
      if (tableName === "error_logs" && index === logId) {
        return Promise.resolve(true);
      } else if (tableName === "user" && index === userId) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    });
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: userId };
      next();
    });
    pool.getConnection.mockImplementation((cb) =>
      cb(new Error("Connection failed"))
    );
    const response = await request(server)
      .delete(`/log/delete`)
      .send({ logId, userId });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Database connection failed." });
  });

  it("5-Should handle SQL query errors", async () => {
    const logId = "123";
    const userId = "456";
    checkIndexExists.mockImplementation((tableName, index) => {
      if (tableName === "error_logs" && index === logId) {
        return Promise.resolve(true);
      } else if (tableName === "user" && index === userId) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    });
    const mockConnection = {
      query: jest.fn((sql, params, callback) =>
        callback(new Error("Query failed"), null)
      ),
      release: jest.fn(),
    };
    pool.getConnection.mockImplementation((callback) =>
      callback(null, mockConnection)
    );

    const response = await request(server)
      .delete(`/log/delete`)
      .send({ logId, userId });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error deleting error logs." });
    expect(mockConnection.release).toHaveBeenCalled();
  });

  //   it("Should return 404 if no error logs are found for the specified user", async () => {
  //     const mockResults = [];
  //     const mockConnection = {
  //       query: jest.fn((sql, params, callback) => {
  //         callback(null, mockResults);
  //       }),
  //       release: jest.fn(),
  //     };

  //     pool.getConnection.mockImplementation((callback) =>
  //       callback(null, mockConnection)
  //     );

  //     const mockReqBody = {
  //       logId: "123",
  //       userId: "456",
  //     };

  //     checkIndexExists.mockResolvedValueOnce(true);

  //     const response = await request(server)
  //       .delete(`/log/delete`)
  //       .send(mockReqBody);

  //     expect(response.status).toBe(404);
  //     expect(response.body).toEqual({
  //       error: "No error logs found for the specified user.",
  //     });
  //     expect(mockConnection.query).toHaveBeenCalled(); // Sorgunun çağrıldığından emin olun
  //   });
});

describe("TC-024", () => {
  it("1-Should return 200 if error logs are deleted successfully", async () => {
    const userId = "00192e95-8ed7-43d2-a871-cd1cc69f2021";
    const mockConnection = {
      query: jest.fn((sql, params, callback) => {
        expect(params).toEqual([userId]);
        callback(null, { affectedRows: 5 });
      }),
      release: jest.fn(),
    };
    checkIndexExists.mockResolvedValueOnce(true);
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: userId };
      next();
    });
    pool.getConnection.mockImplementation((callback) =>
      callback(null, mockConnection)
    );

    const response = await request(server).delete(`/log/delete-all/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Error logs deleted successfully.",
    });
  });

  // it("Should return 400 if no userId is provided", async () => {
  //   const response = await request(server).delete(`/log/delete-all/`);
  //   expect(response.status).toBe(400);
  //   expect(response.body).toEqual({ error: "Invalid parameter." });
  // });

  it("2-Should return 404 if user not exists", async () => {
    const userId = "non-user-id";
    checkIndexExists.mockResolvedValueOnce(false);
    const response = await request(server).delete(`/log/delete-all/${userId}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found." });
  });

  it("3-Should return 404 if no error logs are found for the specified user", async () => {
    const userId = "00192e95-8ed7-43d2-a871-cd1cc69f2021";
    const mockConnection = {
      query: jest.fn((sql, params, callback) => {
        callback(null, { affectedRows: 0 });
      }),
      release: jest.fn(),
    };
    checkIndexExists.mockResolvedValueOnce(true);
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: userId };
      next();
    });
    pool.getConnection.mockImplementation((callback) =>
      callback(null, mockConnection)
    );

    const response = await request(server).delete(`/log/delete-all/${userId}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "No error logs found for the specified user.",
    });
    expect(mockConnection.query).toHaveBeenCalled();
  });

  it("4-Should return 500 if an error occurs during delete operation", async () => {
    const userId = "00192e95-8ed7-43d2-a871-cd1cc69f2021";
    const mockConnection = {
      query: jest.fn((sql, params, callback) => {
        callback(new Error("Error deleting error logs."));
      }),
      release: jest.fn(),
    };
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: userId };
      next();
    });
    checkIndexExists.mockResolvedValueOnce(true);
    pool.getConnection.mockImplementation((callback) =>
      callback(null, mockConnection)
    );

    const response = await request(server).delete(`/log/delete-all/${userId}`);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error deleting error logs." });
    expect(mockConnection.query).toHaveBeenCalled();
  });

  it("5-Should return 500 if database connection fails", async () => {
    const userId = "00192e95-8ed7-43d2-a871-cd1cc69f2021";
    pool.getConnection.mockImplementation((callback) =>
      callback(new Error("Database connection failed."))
    );
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: userId };
      next();
    });
    checkIndexExists.mockResolvedValueOnce(true);
    const response = await request(server).delete(`/log/delete-all/${userId}`);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Database connection failed." });
  });
});
