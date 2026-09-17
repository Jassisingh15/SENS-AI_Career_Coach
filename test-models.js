import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
});

async function test() {
  try {
    const res = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: "Say hello" }],
    });

    console.log(res.choices[0].message.content);
  } catch (err) {
    console.log(err);
  }
}

test();
