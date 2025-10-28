# llm_quiz_generator.py
import os
import json
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

def _create_llm():
    # ChatOpenAI supports passing openai_api_base & openai_api_key
    return ChatOpenAI(
        model_name="openai/gpt-oss-20b:free",
        temperature=0.2,
        openai_api_key=OPENAI_KEY,
        openai_api_base="https://openrouter.ai/api/v1"
    )

_llm = _create_llm()

# To summarize the extracted raw text before asking quiz questions
_summary_prompt = PromptTemplate(
    input_variables=["passage"],
     template=(
        "You are a summarization assistant. Read the passage and produce a single, simple, readable summary.\n\n"
        "RULES:\n"
        "- Return ONLY the summary paragraph.\n"
        "- The summary MUST be between 150 and 200 words.\n"
        "- DO NOT include any part of the original passage.\n"
        "- DO NOT include code, HTML, markdown, bullet points, or special characters.\n"
        "- Normalize any escaped characters into readable text.\n\n"
        "PASSAGE:\n'''{passage}'''\n\n"
        "Write the summary paragraph only:"
    )
)

# Prompt to generate structured JSON quiz + metadata
_quiz_prompt = PromptTemplate(
    input_variables=["summary", "num_questions"],
    template = (
    "You are an assistant that reads the summary (do NOT include it in the output) "
    "and returns a JSON object exactly in this schema:\n\n"
    "{{\n"
    '  "key_entities": {{"people": [], "organizations": [], "locations": []}},\n'
    '  "sections": [],\n'
    '  "quiz": [\n'
    '    {{"question": "", "options": ["", "", "", ""], "answer": "", "difficulty": "easy|medium|hard", "explanation": ""}}\n'
    '  ],\n'
    '  "related_topics": []\n'
    "}}\n\n"
    "Fill all fields using the summary text internally (do NOT include the summary in the JSON). "
    "Generate {num_questions} multiple-choice questions. Each question must have exactly 4 options, "
    "one correct answer, and a short explanation referring to the part of the summary where the answer was found. "
    "Use difficulty levels: easy, medium, or hard. Return ONLY valid JSON — no extra text."
    "SUMMARY:\n'''{summary}'''\n\n"
    )


)

def summarize_text(passage: str) -> str:
    # Returns the summarized passage after giving prompt to gpt
    summary_chain = _summary_prompt | _llm | StrOutputParser()
    return summary_chain.invoke(passage)

def generate_quiz_json(summary: str, num_questions: int = 10) -> str:
    """
    Returns a JSON string (LLM output). Caller should handle parse/check.
    """
    summary_chain = _quiz_prompt | _llm | StrOutputParser()
    raw = summary_chain.invoke({
        "summary": summary,
        "num_questions": str(num_questions)
    })
    # attempt to locate JSON in response and return string
    # if LLM returned extra text, try to extract {...}
    try:
        start = raw.index("{")
        end = raw.rindex("}") + 1
        json_str = raw[start:end]
    except ValueError:
        json_str = raw

    # As a final safety: try to ensure it's valid JSON by parsing, else return raw
    try:
        parsed = json.loads(json_str)
        return parsed
    except Exception:
        # return unparsed string for debugging
        return {}
