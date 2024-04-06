const mockData = {
  users: [
    {
      id: "1",
      username: "user1",
      password: "password1",
      mail: "user1@example.com",
      verification_code: 123456,
      is_verificated: 1,
      tier: "bronze",
    },
    {
      id: "2",
      username: "user2",
      password: "password2",
      mail: "user2@example.com",
      verification_code: 654321,
      is_verificated: 0,
      tier: "silver",
    },
  ],
  paths: [
    {
      id: "1",
      user_id: "1",
      url: "example1.com",
      api_key: "apikey1",
      key: "key1",
      company: "company1",
      type: "type1",
      usage: 10,
      price: 20.5,
    },
    {
      id: "2",
      user_id: "2",
      url: "example2.com",
      api_key: "apikey2",
      key: "key2",
      company: "company2",
      type: "type2",
      usage: 5,
      price: 15.75,
    },
  ],
  api_usage: [
    {
      id: 1,
      user_id: "1",
      path_id: "1",
      timestamp: "2024-04-07 10:30:00",
    },
    {
      id: 2,
      user_id: "2",
      path_id: "2",
      timestamp: "2024-04-07 11:45:00",
    },
  ],
  error_logs: [
    {
      id: 1,
      user_id: "1",
      path_id: "1",
      error_msg: "Error message 1",
      company: "company1",
      type: "type1",
      timestamp: "2024-04-07 12:15:00",
    },
    {
      id: 2,
      user_id: "2",
      path_id: "2",
      error_msg: "Error message 2",
      company: "company2",
      type: "type2",
      timestamp: "2024-04-07 13:30:00",
    },
  ],
};

module.exports = mockData;
