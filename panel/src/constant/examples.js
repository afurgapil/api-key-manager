export const GEMINI = `
    const response = await fetch(example.com/pathId/userId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "prompt":"U2FsdGVkX18YqvU2Mjg84gClRDKj0ed0FjFdOTtB8Lk="
         //encrypted with your private key using AES algorithm
      }),
    }
  );
  `;
export const OPENAI = `
    const response = await fetch(example.com/pathId/userId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "prompt":"U2FsdGVkX18YqvU2Mjg84gClRDKj0ed0FjFdOTtB8Lk="
         //encrypted with your private key using AES algorithm
         "role":"user"
      }),
    }
  );
  `;
