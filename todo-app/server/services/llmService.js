const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function categorizeTask(title) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Categorize tasks into one word: work, school, or home. Only return the category.",
        },
        {
          role: "user",
          content: title,
        },
      ],
    });

    return response.choices[0].message.content.trim().toLowerCase();
  } catch (err) {
    return fallbackCategory(title);
  }
}

// fallback if API fails
function fallbackCategory(title) {
  const t = title.toLowerCase();

  if (t.includes("study") || t.includes("hw") || t.includes("exam"))
    return "school";
  if (t.includes("meeting") || t.includes("project"))
    return "work";

  return "home";
}

module.exports = { categorizeTask };