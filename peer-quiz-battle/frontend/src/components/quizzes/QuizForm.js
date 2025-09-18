import React, { useState } from 'react';
import QuestionForm from './QuestionForm';

const QuizForm = ({ onSubmit, initialData }) => {
  const [quizData, setQuizData] = useState(initialData || {
    title: '',
    description: '',
    questions: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    }));
  };

  const updateQuestion = (index, updatedQuestion) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? updatedQuestion : q
      )
    }));
  };

  const removeQuestion = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate quiz data
    if (quizData.questions.length < 3) {
      alert('Please add at least 3 questions');
      return;
    }
    
    // Validate each question
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      if (!question.text.trim()) {
        alert(`Question ${i + 1} is missing text`);
        return;
      }
      
      if (question.options.some(opt => !opt.trim())) {
        alert(`Question ${i + 1} has empty options`);
        return;
      }
    }
    
    onSubmit(quizData);
  };

  return (
    <form onSubmit={handleSubmit} className="quiz-form">
      <div className="form-group">
        <label htmlFor="title">Quiz Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={quizData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={quizData.description}
          onChange={handleInputChange}
          rows="3"
        />
      </div>
      
      <div className="questions-section">
        <h3>Questions</h3>
        {quizData.questions.map((question, index) => (
          <QuestionForm
            key={index}
            index={index}
            question={question}
            onChange={updateQuestion}
            onRemove={removeQuestion}
          />
        ))}
        
        <button type="button" onClick={addQuestion} className="add-question-btn">
          Add Question
        </button>
      </div>
      
      <button type="submit" className="submit-btn">
        {initialData ? 'Update Quiz' : 'Create Quiz'}
      </button>
    </form>
  );
};

export default QuizForm;