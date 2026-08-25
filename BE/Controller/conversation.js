const { Message } = require("../Schema/message");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const mongoose = require("mongoose");
const { DocumentChunk } = require("../Schema/documentChunk");
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const { Conversation } = require("../Schema/conversation");
const { GoogleGenAI } = require("@google/genai");
const GEMINI_KEY = process.env.GEMINI_KEY;
const ChatWithGemini = async (previousInteractionId, value, context) => {
  const client = new GoogleGenAI({
    apiKey: GEMINI_KEY,
  });

  const weatherFunctionDeclaration = {
    type: "function",
    name: "get_current_temperature",
    description: "Gets the current temperature for a given location.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city name, e.g. San Francisco",
        },
      },
      required: ["location"],
    },
  };
  const prompt = `
You are answering questions about an uploaded PDF.

Use only the following PDF context.

Context:
${context}

Question:
${value}

If the answer is not available in the context, say that you
couldn't find the information in the uploaded PDF.
`;
  const interaction = await client.interactions.create({
    model: "gemini-3.5-flash-lite",
    // input: value,
    input: prompt,
    store: true,

    // 👇 connect to previous conversation
    ...(previousInteractionId && {
      previous_interaction_id: previousInteractionId,
    }),

    tools: [weatherFunctionDeclaration],
  });

  let finalInteraction = interaction;

  for (const step of interaction.steps) {
    if (step.type === "function_call") {
      if (step.name === "get_current_temperature") {
        finalInteraction = await client.interactions.create({
          model: "gemini-3.5-flash-lite",

          previous_interaction_id: interaction.id,

          input: [
            {
              type: "function_result",
              name: step.name,
              call_id: step.id,
              result: [
                {
                  type: "text",
                  text: JSON.stringify("70 deg"),
                },
              ],
            },
          ],

          tools: [weatherFunctionDeclaration],
        });
      }
    }
  }

  return {
    text: finalInteraction.output_text,
    interactionId: finalInteraction.id,
  };
};
async function addChatInConversation(req, res) {
  try {
    const { conversationId, role, content } = req.body;

    // 1. Save user message
    await Message.insertOne({
      conversationId,
      role,
      content,
    });

    // 2. Get conversation
    const conversation = await Conversation.findById(conversationId);

    const previousInteractionId = conversation?.lastInteractionId;

    // 3. Search PDF
    const relevantChunks = await similaritySearch(content, conversationId);

    // 4. Build context
    const context = relevantChunks.map((item) => item.text).join("\n\n");

    console.log("Retrieved chunks:", relevantChunks);

    // 5. Ask Gemini using PDF context
    const aiResponse = await ChatWithGemini(
      previousInteractionId,
      content,
      context,
    );

    // 6. Save Gemini response
    await Message.insertOne({
      conversationId,
      role: "model",
      content: aiResponse?.text ?? "-",
    });

    // 7. Save interaction ID
    await Conversation.findByIdAndUpdate(conversationId, {
      lastInteractionId: aiResponse.interactionId,
    });

    // 8. Return messages
    const newMessageList = await Message.find({
      conversationId,
    });

    return res.status(200).json({
      data: newMessageList,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
// async function addChatInConversation(req, res) {
//   try {
//     const { conversationId, role, content } = req.body;

//     // 1. Save user's message
//     await Message.insertOne({
//       conversationId,
//       role,
//       content,
//     });

//     // 2. Get conversation
//     const conversation = await Conversation.findById(conversationId);

//     // 3. Get previous Gemini interaction ID
//     const previousInteractionId = conversation?.lastInteractionId;

//     // 4. Send message to Gemini
//     const aiResponse = await ChatWithGemini(previousInteractionId, content);

//     console.log(aiResponse, "aiResponse");

//     // 5. Save Gemini response
//     await Message.insertOne({
//       conversationId,
//       role: "model",
//       content: aiResponse?.text ?? "-",
//     });

//     // 6. VERY IMPORTANT:
//     // Store the latest Gemini interaction ID
//     await Conversation.findByIdAndUpdate(conversationId, {
//       lastInteractionId: aiResponse.interactionId,
//     });

//     // 7. Get updated messages
//     const newMessageList = await Message.find({
//       conversationId,
//     });

//     return res.status(200).json({
//       data: newMessageList,
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({
//       message: "Something went wrong",
//     });
//   }
// }

async function getConversationList(req, res) {
  try {
    const list = await Conversation.find();
    res.json({
      status: 200,
      data: list,
    });
  } catch (e) {
    console.log(e);
  }
}

async function createConversationList(req, res) {
  try {
    const list = await Conversation.insertOne({ name: req?.body?.name });

    return res.status(200).json({
      data: list,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
async function uploadDoc(req, res) {
  try {
    console.log(req?.file, req?.body, "req?.body");
    const parser = new PDFParse({ url: req.file.path });

    const result = await parser.getText();
    console.log(result, "pdfDatapdfData");
    const text = result.text;
    const chunks = chunkText(text);
    const embeddings = await createEmbeddings(chunks);
    console.log(embeddings[0].length, "embeddingsembeddings");
    const documents = chunks.map((chunk, index) => ({
      conversationId: req.body.conversationId,
      fileName: req.file.originalname,
      text: chunk,
      embedding: embeddings[index],
    }));

    // 4. Save to MongoDB
    await DocumentChunk.insertMany(documents);

    return res.status(200).json({
      message: "PDF processed successfully",
      totalChunks: chunks.length,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
async function similaritySearch(question, conversationId) {
  // 1. Create embedding for user question
  const questionEmbedding = await createEmbeddings([question]);

  const queryVector = questionEmbedding[0];

  // 2. Search MongoDB
  const results = await DocumentChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector,
        numCandidates: 100,
        limit: 5,
        filter: {
          conversationId: new mongoose.Types.ObjectId(conversationId),
        },
      },
    },
    {
      $project: {
        _id: 1,
        text: 1,
        fileName: 1,
        conversationId: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  return results;
}
async function createEmbeddings(chunks) {
  const ai = new GoogleGenAI({
    apiKey: GEMINI_KEY,
  });
  const embeddings = [];

  for (const chunk of chunks) {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: chunk,
    });

    embeddings.push(response.embeddings[0]?.values);
  }

  return embeddings;
}
function chunkText(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;

    chunks.push(text.slice(start, end));

    start += chunkSize - overlap;
  }

  return chunks;
}
async function getConversationItemList(req, res) {
  try {
    const data = await Message.find({ conversationId: req?.body?.id });
    res.status(200).json({
      data: data,
    });
  } catch (e) {
    console.log(e);
  }
}
module.exports = {
  addChatInConversation,
  createConversationList,
  getConversationList,
  similaritySearch,
  uploadDoc,
  getConversationItemList,
};
