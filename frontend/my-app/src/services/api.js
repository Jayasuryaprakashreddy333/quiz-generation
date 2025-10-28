

const API_BASE_URL = 'http://localhost:5000';

export async function generateQuiz(url) {
    console.log("Request body:", JSON.stringify({ url }));
    const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate quiz');
  }

  const data = await response.json();
  console.log("Response data:", data);
  return data;
}

export async function fetchQuizHistory() {
  const response = await fetch(`${API_BASE_URL}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch quiz history');
  }
  const data = await response.json();
  return data;
}       

export async function fetchQuizById(quizId) {
  const response = await fetch(`${API_BASE_URL}/history/${quizId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch quiz');
  }
  const data = await response.json();
  return data;
}
