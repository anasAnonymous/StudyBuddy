### **Project Plan: Study Buddy**  

---

### **Core Features**  

1. **Professor Persona Implementation**  
   - **Goal**: Simulate a professor persona tailored for different domains.  
   - **Approach**:  
     - Assign domain-specific roles to the AI bot via prompts when interacting with Gemini Flash 2.0 API.  
     - Example prompt for cybersecurity:  
       ```plaintext  
       "You are a cybersecurity professor with 10+ years of experience. Your task is to explain cybersecurity concepts in [comprehension level] with a [tone] style. Keep responses [content length]."  
       ```  
     - **Persona Customization**:  
       - **Professor Profiles**: Add different professor profiles for each domain with names, avatars, and brief descriptions.  
       - **Avatars**: Use illustrations or AI-generated avatars representing friendly professors with domain-specific symbols (e.g., shield for cybersecurity, dollar sign for finance).  

---

2. **User Interaction Page**  
   - **Features**:  
     - Dropdown or toggle buttons for:  
       - **Comprehension Level**: Layman, High School, College, Expert  
       - **Content Length**: Short, Medium, Long  
       - **Tone**: Friendly, Formal, Informal  
     - Chat interface for users to ask questions or request explanations.  
     - Flashcard button to generate flashcards for the current topic.  
     - "Save as PDF" button for responses, flashcards, scenarios, and test results.  
     - Sidebar for navigation:  
       - **Chat**  
       - **Flashcards**  
       - **Scenarios**  
       - **Tests & Results**

---

3. **Flashcard Generation**  
   - **Logical Design**:  
     - Input: Current chat topic or user-provided topic.  
     - Process:  
       1. Query the AI bot for key points and concepts.  
       2. Generate flashcards with:  
          - **Front**: Concept or Question  
          - **Back**: Explanation or Answer  
     - Output: A set of flashcards displayed in a carousel or grid view.  
     - Additional Feature: Option to export flashcards as a printable PDF.  

---

4. **Scenario Generation**  
   - **Logical Design**:  
     - Input: User-selected topic.  
     - Process:  
       1. Query the AI bot for a real-world scenario related to the topic.  
       2. Format the scenario as a brief story or case study.  
       3. Include follow-up questions to encourage critical thinking.  
     - Output: Scenario displayed with a "Discuss" button for further explanation.  

---

5. **Test Generation (MCQs & Results)**  
   - **Logical Design**:  
     - Input: Selected topic or recent chat discussion.  
     - Process:  
       1. Query the AI bot to generate 5-10 multiple-choice questions.  
       2. Store correct answers for automatic grading.  
       3. Allow users to answer questions and display results with explanations.  
     - Output: Test interface with questions and options.  
     - Additional Features:  
       - Save results as PDF.  
       - "Retake Test" button.  

---

---

### **Technical Stack Suggestions**  

- **Frontend**:  
  - Next.js + Tailwind CSS for a responsive and clean UI.  
  - Redux or Context API for state management.  
- **Backend**:  
  - Node.js with Express.    
- **AI Integration**:  
  - Gemini Flash 2.0 via API key for generating content.  
  - LangChain (if using other LLMs) for advanced prompt handling.  
- **Database**:  
  - Firebase
- **Deployment**:  
  - Vercel/Netlify for frontend.  
  - Render/Heroku for backend.  
---

### **Discussion Points for the Team Meeting**  

1. **Assigning Professor Roles**  
   - How should we structure prompts for each domain?  
   - Should we offer a single professor persona or multiple selectable ones?  
2. **Flashcard Design**  
   - What format should we use for flashcards (grid view, carousel)?  
   - Should we allow users to add personal notes to flashcards?  
3. **PDF Export Feature**  
   - How do we ensure proper formatting for exported PDFs?  
   - Should we include the professor’s avatar and persona details in the export?  

---
