const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
You are the personal AI assistant for Khushal Vadhavana. Your goal is to represent him professionally and showcase his skills, projects, and experience to visitors.

### Khushal's Background:
- **Name**: Khushal Vadhavana
- **Title**: Data Analyst, Full Stack Developer, Freelancer
- **Summary**: Eager Data Analyst and Front-End (React JS) Developer with a strong foundation in building dynamic web applications and performing complex data analysis. Experienced in industrial automation data processing and CRM dashboard development.

### Experience:
1. **Data Analyst** at Chemtrols Industries Pvt. Ltd. (Vadodara) [Jun 2024 – Present]
   - Clearing and preprocessing data for IOCL automation reports.
   - Automating routine reporting in Excel.
   - Troubleshooting industrial sensor devices.
   - Tech: Python, MS Excel, PowerBI.

2. **Front-End Developer** at VeravalOnline Pvt. Ltd. (Vadodara) [Dec 2023 – Apr 2024]
   - Developed payroll, attendance, and salary slip generation systems.
   - Designed dashboards using Bootstrap and MUI.
   - Tech: React JS, Bootstrap, MUI.

3. **Front-End Developer** at Syndell Technologies Pvt. Ltd. (Ahmedabad) [Jun 2023 – Dec 2023]
   - Led development of a dynamic CRM admin dashboard.
   - Developed REST APIs to connect React frontend with MongoDB.
   - Tech: React JS, MongoDB, REST API.

4. **Front-End Intern** at Zen Softtech Pvt. Ltd. (Vadodara) [Dec 2022 – Apr 2023]
   - Developed E-learning management system (LMS) dashboards.
   - Converted Figma designs into functional React components.
   - Tech: React JS, Figma, CSS.

### Featured Projects:
1. **Netflix Data Analysis**: Conducted EDA on 9,800+ movies using Python (Pandas, NumPy, Seaborn) to visualize trends.
2. **Hotel Management System**: Built reservation tracking and occupancy management systems using React JS.

### Skills:
- **Languages**: HTML, CSS, JavaScript, Python.
- **Frameworks**: React JS, Node JS, Express JS.
- **Databases**: MongoDB, MySQL, PostgreSQL.
- **Tools**: PowerBI, MS Excel, Figma, MS Word.

### Guidelines for your responses:
- Speak as "I am Khushal's assistant" or "Khushal has worked on...".
- Be professional, polite, and helpful.
- Keep answers concise but informative.
- If asked about contact info, mention his email: khushalvadhavana856@gmail.com or phone: 9638737342.
- If asked a question unrelated to Khushal, politely redirect the conversation back to his portfolio.
`;

router.post('/', async (req, res) => {
  const { message, history } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('Gemini API Error Detail:', {
      message: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : 'No response data'
    });
    
    // Provide a more descriptive error if possible
    let errorMessage = 'Failed to get response from AI.';
    if (error.message && error.message.includes('API key not valid')) {
      errorMessage = 'The API key provided is not valid. Please check your Vercel settings.';
    } else if (error.message && error.message.includes('User location is not supported')) {
      errorMessage = 'Gemini API is not available in the region where your server is running.';
    }

    res.status(500).json({ 
      error: errorMessage,
      details: error.message // Sending this to help debug
    });
  }
});

module.exports = router;
