const pool = require("../../utils/settings/usePool");
const checkIndexExists = require("../../utils/basicQueries/checkIndexExists");
jest.mock("../../utils/settings/usePool", () => {
  return {
    getConnection: jest.fn().mockImplementation((callback) => {
      callback(null, {
        query: jest.fn().mockImplementation((query, values, callback) => {
          if (query.includes("SELECT")) {
            if (values.includes("999")) {
              callback(null, []);
            } else {
              const results = [{ url: "example1.com", key: "key1" }];
              callback(null, results);
            }
          }
        }),
        release: jest.fn(),
      });
    }),
  };
});
describe("TC-006", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Returns true if index exists in the table", async () => {
    pool.getConnection.mockImplementationOnce((callback) => {
      callback(null, {
        query: jest.fn().mockImplementation((query, values, callback) => {
          const results = [{ id: 1 }];
          callback(null, results);
        }),
        release: jest.fn(),
      });
    });

    const tableName = "example_table";
    const index = 1;
    const exists = await checkIndexExists(tableName, index);

    expect(exists).toBe(true);
  });

  test("Returns false if index does not exist in the table", async () => {
    pool.getConnection.mockImplementationOnce((callback) => {
      callback(null, {
        query: jest.fn().mockImplementation((query, values, callback) => {
          const results = [];
          callback(null, results);
        }),
        release: jest.fn(),
      });
    });

    const tableName = "example_table";
    const index = 999;
    const exists = await checkIndexExists(tableName, index);

    expect(exists).toBe(false);
  });

  test("Rejects with an error if database connection fails", async () => {
    pool.getConnection.mockImplementationOnce((callback) => {
      const error = new Error("Database connection failed");
      callback(error);
    });

    const tableName = "example_table";
    const index = 1;
    await expect(checkIndexExists(tableName, index)).rejects.toThrow(
      "Database connection failed"
    );
  });

  test("Rejects with an error if database query fails", async () => {
    pool.getConnection.mockImplementationOnce((callback) => {
      callback(null, {
        query: jest.fn().mockImplementation((query, values, callback) => {
          const error = new Error("Query execution failed");
          callback(error);
        }),
        release: jest.fn(),
      });
    });

    const tableName = "example_table";
    const index = 1;
    await expect(checkIndexExists(tableName, index)).rejects.toThrow(
      "Query execution failed"
    );
  });
});
