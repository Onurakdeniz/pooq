function sendRequest(url, options) {
    return fetch(url, options)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        return response.json();
      })
      .catch(function (error) {
        throw new Error("Network error: " + error.message);
      });
  }
  
  function createHttpResponse(code, headers, body) {
    return {
      code: code,
      headers: headers,
      body: body,
    };
  }
  
  function main(body) {
    return new Promise(function (resolve, reject) {
      try {
        const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
        const INDEX_HOST = process.env.INDEX_HOST;
  
        if (!PINECONE_API_KEY || !INDEX_HOST) {
          throw new Error("Missing required environment variables");
        }
  
        if (!body) {
          throw new Error("Request body is missing");
        }
  
        const payload = JSON.parse(body);
        if (!payload.hash) {
          throw new Error("Hash must be provided in the request payload");
        }
  
        const queryPayload = {
          topK: payload.topK || 5,
          id: payload.hash,  // Use the hash as the vector
        };
  
        sendRequest(`https://${INDEX_HOST}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Key": PINECONE_API_KEY,
          },
          body: JSON.stringify(queryPayload),
        })
          .then(function (pineconeData) {
            resolve(
              createHttpResponse(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify({
                  message: "Successfully queried Pinecone index",
                  results: pineconeData.matches,
                }),
              ),
            );
          })
          .catch(function (error) {
            throw error;
          });
      } catch (error) {
        console.error("Error processing request:", error);
        resolve(
          createHttpResponse(
            500,
            { "Content-Type": "application/json" },
            JSON.stringify({
              error: "Error processing request",
              message: error.message,
            }),
          ),
        );
      }
    });
  }