export async function POST(req: Request) {
  try {
    const apiKey = process.env.NEXT_GOOGLE_API_KEY;
    if (!apiKey) return Response.json({ error: 'No API Key' }, { status: 500 });

    const body = await req.json();
    const { action } = body;
    console.log(`[AI Tutor] Action: ${action}`);

    const callGemini = async (prompt: string) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.candidates[0].content.parts[0].text;
    };

    if (action === 'generate-task') {
      const { previousTasks, difficulty } = body;
      const isEasy = difficulty === 'very-easy';
      const prompt = `IHK AP2 FiSi Tutor (German). JSON structure: {"taskType":"","prompt":"","sentence":"","expectedAnswerFormat":""}. JSON ONLY.
        Randomly choose: Networking, Hardware, Server, Security, Cloud, SQL, Programming.
        Use "Nennen" (list) or "Erläutern" (describe).
        Avoid: ${previousTasks?.slice(-5).join(', ') || 'none'}.
        ${isEasy ? 'VERY EASY TASK.' : ''}`;
      
      const text = await callGemini(prompt);
      return Response.json(JSON.parse(text.replace(/```json|```/g, '').trim()));
    }

    if (action === 'evaluate-task') {
      const { task, userAnswer } = body;
      const isEmpty = !userAnswer || userAnswer.trim().length === 0;

      const prompt = `Evaluate answer for IHK AP2 (German). 
        BE FRIENDLY AND ENCOURAGING. Use "Du" (informal). 
        JSON ONLY: {"isCorrect":bool,"points":0-4,"correction":"","explanation":"","topicsToReview":[]}.
        
        Rules:
        - points: 0-4 (4=perfect, 3=mostly, 2=half, 1=tiny bit, 0=nothing or skip).
        - If userAnswer is empty: isCorrect=false, points=0, correction="Hier jest die Lösung", explanation="Details...".
        - correction: max 2 sentences. 
        - explanation: technical details.
        
        Task: ${task?.sentence}. 
        UserAnswer: ${userAnswer}`;

      const text = await callGemini(prompt);
      return Response.json(JSON.parse(text.replace(/```json|```/g, '').trim()));
    }

    if (action === 'ask-question') {
      const { task, userAnswer, evaluation, userQuestion } = body;
      const prompt = `IHK Expert. Context: Task: ${task?.sentence}. Answer: ${userAnswer}. Answer kindly in German, max 3 sentences. "${userQuestion}".`;
      const text = await callGemini(prompt);
      return Response.json({ answer: text });
    }

    if (action === 'generate-summary') {
      const { allEvaluations } = body;
      const simplified = allEvaluations.map((e: any) => ({ c: e.isCorrect, p: e.points, t: e.topicsToReview }));
      const prompt = `Final IHK summary (German). Data: ${JSON.stringify(simplified)}. Kind feedback. JSON ONLY: {"feedback":"","topicsToLearn":[]}`;
      const text = await callGemini(prompt);
      return Response.json(JSON.parse(text.replace(/```json|```/g, '').trim()));
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[AI Tutor ERROR]:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
