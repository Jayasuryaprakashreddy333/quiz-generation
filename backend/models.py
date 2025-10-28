# models.py
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class QuizItem(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: Optional[str] = None
    explanation: Optional[str] = None

class QuizOutput(BaseModel):
    key_entities: Optional[Dict[str, List[str]]] = {}
    sections: Optional[List[str]] = []
    quiz: List[QuizItem]
    related_topics: Optional[List[str]] = []
    created_at: Optional[datetime] = None
