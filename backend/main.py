from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from scraper import fetch_wikipedia_text, clean_text
from llm_quiz_generator import summarize_text, generate_quiz_json
from database import SessionLocal, Quiz, init_db
from models import QuizOutput

# Initialize FastAPI
app = FastAPI(title="AI Quiz Generator")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB
init_db()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def save_quiz_to_db(url: str, title: str, summary: str, quiz_json: dict, db: Session):
    quiz_entry = Quiz(
        url=url,
        title=title,
        summary=summary,
        quiz_json=json.dumps(quiz_json, ensure_ascii=False)
    )
    db.add(quiz_entry)
    db.commit()
    db.refresh(quiz_entry)
    return quiz_entry.id


@app.post("/generate-quiz")
def generate_quiz_route(data: dict, db: Session = Depends(get_db)):
    url = data.get("url")
    print(url)
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    # Scrape the wiki page
    title, passage = fetch_wikipedia_text(url)
    passage = clean_text(passage)

    # Summarize the passage
    summary = summarize_text(passage)

    # Quiz generation through LLM
    quiz_json = generate_quiz_json(summary)
    if not quiz_json:
        raise HTTPException(status_code=500, detail="Failed to generate quiz")

    # Validate and parse the LLM output using Pydantic
    try:
        validated_quiz = QuizOutput(
            key_entities=quiz_json.get("key_entities", {}),
            sections=quiz_json.get("sections", []),
            quiz=quiz_json.get("quiz", []),
            related_topics=quiz_json.get("related_topics", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM output validation failed: {str(e)}")

    # Save to database
    quiz_id = save_quiz_to_db(url, title, summary, quiz_json, db)

    # Return response with quiz
    return {
        "id": quiz_id,
        "url": url,
        "title": title,
        "summary": summary,
        "quiz": validated_quiz.dict()
    }


@app.get("/history")
def history(limit: int = 50, db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).order_by(Quiz.created_at.desc()).limit(limit).all()
    out = []
    for quiz in quizzes:
        try:
            quiz_data = json.loads(quiz.quiz_json)
        except Exception:
            quiz_data = {"raw": quiz.quiz_json}
        out.append({
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "summary": quiz.summary,
            "quiz": quiz_data,
            "created_at": quiz.created_at.isoformat()
        })
    return out


@app.get("/history/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    try:
        quiz_data = json.loads(quiz.quiz_json)
    except Exception:
        quiz_data = {"raw": quiz.quiz_json}
    return {
        "id": quiz.id,
        "url": quiz.url,
        "title": quiz.title,
        "summary": quiz.summary,
        "quiz": quiz_data,
        "created_at": quiz.created_at.isoformat()
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}
