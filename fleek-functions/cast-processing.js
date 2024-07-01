/**
 * Sends an HTTP request.
 * @param {string} url - The URL to send the request to.
 * @param {Object} options - The options for the request.
 * @param {string} options.method - The HTTP method.
 * @param {Record<string, string>} options.headers - The headers for the request.
 * @param {string} [options.body] - The body of the request.
 * @returns {Promise<Object>} The response data.
 */
async function sendRequest(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
  
  /**
   * Creates an HTTP response object.
   * @param {number} code - The HTTP status code.
   * @param {Record<string, string>} headers - The headers for the response.
   * @param {any} body - The body of the response.
   * @returns {Object} The HTTP response object.
   */
  function createHttpResponse(code, headers, body) {
    return {
      code: code,
      headers: headers,
      body: body,
    };
  }
  
  /**
   * Main function to process the request.
   * @param {Object} params - The parameters for the function.
   * @param {Object} params.body - The body of the request.
   * @param {string} params.body.id - The ID of the request.
   * @param {string} params.body.type - The type of the request.
   * @param {string} params.body.hash - The hash of the request.
   * @param {string} params.body.text - The text of the request.
   * @returns {Promise<Object>} The HTTP response object.
   */
  export const main = async (params) => {
    try {
      const payload = params.body;
      const { id, type, hash, text } = payload;
  
      // Use environment variables
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;
      const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4";
      const OPENAI_API_URL = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
  
      const prompt = type === "STORY" ? SYSTEM_PROMPT : SYSTEM_PROMPT;
  
      // Prepare the OpenAI API request payload
      const openaiPayload = {
        "model": OPENAI_MODEL,
        "messages": [
          { "role": "system", "content": prompt },
          { "role": "user", "content": text }
        ],
        "temperature": 0,
        "max_tokens": 2000
      };
  
      // Send request to OpenAI API
      const openaiResponse = await sendRequest(OPENAI_API_URL, {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        "body": JSON.stringify(openaiPayload)
      });
    
      // Extract the assistant's response
      const assistantResponse = JSON.parse(openaiResponse.choices[0].message.content);
  
      // Prepare the update payload
      const updatePayload = {
        id,
        hash,
        type,
        title: assistantResponse.Title,
        category: assistantResponse.Category,
        tags: assistantResponse["Short Tags"],
        entities: assistantResponse.Entities,
      };
  
      // Return the updatePayload as the response
      return createHttpResponse(200, { "Content-Type": "application/json" }, updatePayload);
  
    } catch (error) {
      console.error("Error processing request:", error, params);
  
      // Return an error response using createHttpResponse
      return createHttpResponse(500, { "Content-Type": "application/json" }, { "error": "Error processing request" });
    }
  };