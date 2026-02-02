import { configDotenv } from "dotenv";
configDotenv();

const getAPIresponse = async (message) => {
  try {
    // Validate input
    if (!message) {
      throw new Error("Message field is required");
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    // Format messages based on input type
    let formattedMessages;
    
    if (Array.isArray(message)) {
      // It is a history array, so we format it
      formattedMessages = formatHistoryForGemini(message);
    } else {
      // It is a simple string, so we wrap it manually
      formattedMessages = [
        { 
          role: "user", 
          parts: [{ text: String(message) }] 
        }
      ];
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: formattedMessages
      })
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}
`,
      options
    );
    
    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      throw new Error(data.error.message || "Gemini API Error");
    }

    // Extract and return the generated text
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return generatedText;

  } catch (error) {
    console.error("Server Error:", error);
    throw error; // Re-throw to let caller handle it
  }
};

// Helper function to format history (you'll need to implement this based on your needs)
const formatHistoryForGemini = (history) => {
  return history.map(msg => ({
    role: msg.role || "user",
    parts: [{ text: String(msg.content || msg.text || msg.message) }]
  }));
};

export default getAPIresponse;