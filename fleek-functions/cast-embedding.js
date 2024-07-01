export const main = async (params) => {
    try {
      const payload = params.body;
      const { type, hash, text, tags, entities, category } = payload;
      
      const storyId = type.toUpperCase() === 'POST' ? payload.storyId : null;
      
      // Use environment variables for API keys
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
      const PINECONE_POST = process.env.PINECONE_POST_ENDPOINT;
      const PINECONE_STORY = process.env.PINECONE_STORY_ENDPOINT;
  
      const embeddingPayload = {
        "input": text,
        "model": "text-embedding-3-large",
        "encoding_format": "float"
      };
  
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(embeddingPayload)
      });
  
      if (!embeddingResponse.ok) {
        throw new Error(`OpenAI API error! status: ${embeddingResponse.status}`);
      }
  
      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;
  
      const metadata = { tags, entities, category, type };
  
      if (type.toUpperCase() === 'POST' && storyId) {
        metadata.storyId = storyId;
      }
  
      const pineconeEndpoint = type.toUpperCase() === 'POST' ? PINECONE_POST : PINECONE_STORY;
      const pineconePayload = {
        vectors: [{
          id: hash,
          values: embedding,
          metadata: metadata
        }]
      };
  
      const pineconeResponse = await fetch(`${pineconeEndpoint}/vectors/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": PINECONE_API_KEY
        },
        body: JSON.stringify(pineconePayload)
      });
  
      if (!pineconeResponse.ok) {
        throw new Error(`Pinecone API error! status: ${pineconeResponse.status}`);
      }
  
      await pineconeResponse.json();
  
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Successfully stored embedding data in Pinecone",
          type: type,
          embedding: embedding
        })
      };
    } catch (error) {
      console.error("Error processing request:", error);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          error: "Error processing request",
          message: error.message
        })
      };
    }
  }