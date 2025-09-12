// backend/server.js
const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

function buildPrompt(type, payload, user, comment){
  if(type === 'scholarship'){
    return `You are an expert educational counsellor. Provide a helpful, structured answer (bulleted) for scholarships and application steps.
Student details:
- Class: ${payload.class}
- Marks: ${payload.marks}
- Field: ${payload.field || 'not given'}
- State/Category: ${payload.state || 'not given'}
- Extra note: ${comment || 'none'}

Respond with:
1) Top scholarship options to check (state + national)
2) Eligibility summary
3) Required documents
4) Action plan (next 3 steps)
Be concise and actionable.`;
  }

  if(type === 'career'){
    return `You are a career counsellor. Student details:
- Class: ${payload.class}
- Favourite subjects: ${payload.subjects}
- Strengths/hobbies: ${payload.strengths}
- Extra note: ${comment || 'none'}

Give:
1) Recommended streams (with reason)
2) Example college types and selection tips
3) 6-month preparation plan (courses, activities)
Keep answer practical and short.`;
  }

  // job type
  return `You are a career coach for fresh graduates.
Student details:
- Degree: ${payload.degree}
- Major subjects: ${payload.major}
- Interests: ${payload.interest}
- Extra note: ${comment || 'none'}

Respond with:
1) Top 4 job roles that match
2) Key skills and projects to build
3) 3-month learning plan
4) Next steps to get internships / jobs.
Be practical and provide resources (names of common learning platforms).`;
}

// API endpoint
app.post('/api/suggest', async (req, res) => {
  try {
    const { type, payload, user, comment } = req.body || {};
    if(!type || !payload) return res.status(400).json({error: 'Missing type or payload'});

    const prompt = buildPrompt(type, payload, user, comment);

    if(!OPENAI_KEY){
      // Demo fallback if API key not set
      return res.json({ text: `Demo mode: OPENAI_API_KEY not set on server.\nThe prompt that would be sent:\n\n${prompt}` });
    }

    // Build request for OpenAI Chat API (chat completions)
    // Adjust model based on your account (gpt-4, gpt-4o, etc.)
    const body = {
      model: 'gpt-4o', // change if you don't have access
      messages: [
        { role: 'system', content: 'You are an expert education & career counsellor.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700,
      temperature: 0.2
    };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if(!resp.ok){
      const txt = await resp.text();
      console.error('OpenAI error', txt);
      return res.status(500).json({ error: 'OpenAI API error', detail: txt });
    }

    const json = await resp.json();
    const text = json.choices?.[0]?.message?.content || 'No content from model';
    return res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));