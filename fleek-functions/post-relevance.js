async function sendRequest(url, options) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Network error: ${error.message}`);
    }
  }
  
  function createHttpResponse(code, headers, body) {
    return {
      statusCode: code,
      headers: headers,
      body: JSON.stringify(body),
    };
  }
  
  export const main = async (params) => {
    try {
      const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
      const PINECONE_STORY_URL = process.env.PINECONE_STORY_URL;
      const PINECONE_POST_URL = process.env.PINECONE_POST_URL;
  
      if (!params.body) {
        throw new Error("Request body is missing");
      }
  
      let payload;
      if (typeof params.body === "string") {
        try {
          payload = JSON.parse(params.body);
        } catch (error) {
          console.error("Error parsing request body:", error);
          throw new Error("Invalid JSON in request body");
        }
      } else if (typeof params.body === "object") {
        payload = params.body;
      } else {
        throw new Error("Invalid request body");
      }
  
      if (!payload.storyHash || !payload.postHash) {
        throw new Error(
          "Story hash and post hash must be provided in the request payload",
        );
      }
  
      const storyVector = await getVector(
        payload.storyHash,
        PINECONE_STORY_URL,
        PINECONE_API_KEY,
      );
      const postVector = await getVector(
        payload.postHash,
        PINECONE_POST_URL,
        PINECONE_API_KEY,
      );
  
      const similarity = cosineSimilarity(storyVector, postVector);
      const isPostRelevant = similarity > 0.3;
  
      return createHttpResponse(
        200,
        {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        {
          message: "Successfully checked post relevance",
          result: {
            storyHash: payload.storyHash,
            postHash: payload.postHash,
            isPostRelevant: isPostRelevant,
          },
        },
      );
    } catch (error) {
      console.error("Error processing request:", error);
      return createHttpResponse(
        500,
        {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        {
          error: "Error processing request",
          message: error.message,
          stack: error.stack,
        },
      );
    }
  
    async function getVector(hash, url, PINECONE_API_KEY) {
      const queryPayload = {
        topK: 1,
        includeValues: true,
        id: hash,
      };
  
      const response = await sendRequest(`${url}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": PINECONE_API_KEY,
        },
        body: JSON.stringify(queryPayload),
      });
  
      if (response.matches && response.matches.length > 0) {
        return response.matches[0].values;
      } else {
        throw new Error(`No vector found for hash: ${hash}`);
      }
    }
  
    function cosineSimilarity(vec1, vec2) {
      const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
      const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
      const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
      return dotProduct / (magnitude1 * magnitude2);
    }
  };