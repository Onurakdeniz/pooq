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
 * @param {string} params.text - The text to analyze.
 * @param {string[]} params.tags - The list of tags to choose from.
 * @returns {Promise<Object>} The HTTP response object.
 */
export const main = async (params) => {
    try {
        const { text, tags } = params;

        // Use environment variables
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || `You are an advanced text analysis system. Your task is to analyze the provided text and the given list of tags. Select the most relevant tags from the list that best describe the content of the text.

        Please format your response as a JSON selected tags array.
        "selected_tags": An array of the most relevant tags you've selected.

        Text to analyze: "${text}"

        List of tags to choose from: ${JSON.stringify(tags)}

        Analyze the text and select the most appropriate tags from the provided list.`;

        const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4";
        const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';

        // Prepare the OpenAI API request payload
        const openaiPayload = {
            "model": OPENAI_MODEL,
            "messages": [
                { "role": "system", "content": SYSTEM_PROMPT },
                { "role": "user", "content": "Please analyze the text and tags as instructed." }
            ],
            "temperature": 0,
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

        // Prepare the response payload
        const responsePayload = {
            selectedTags: assistantResponse.selected_tags,
            explanations: assistantResponse.explanations
        };

        // Return the responsePayload as the response
        return createHttpResponse(200, { "Content-Type": "application/json" }, responsePayload);

    } catch (error) {
        console.error("Error processing request:", error);

        // Return an error response using createHttpResponse
        return createHttpResponse(500, { "Content-Type": "application/json" }, { "error": "Error processing request" });
    }
};