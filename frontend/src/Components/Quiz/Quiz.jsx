
import React, { useState, useEffect } from 'react';
import './Quiz.css';
import QUIZResult from './QUIZResult';

const Quiz = () => {
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [clickedOption, setClickedOption] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }
                return response.json();
            })
            .then(data => {
                // Shuffle the questions array
                const shuffledQuestions = data.sort(() => Math.random() - 0.5);
                // Select the first 10 questions
                const selected = shuffledQuestions.slice(0, 10);
                setSelectedQuestions(selected);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const changeQuestion = () => {
        updateScore();
        if (currentQuestion < 9) {
            setCurrentQuestion(currentQuestion + 1);
            setClickedOption(0);
        } else {
            setShowResult(true);
        }
    }

    const updateScore = () => {
        if (clickedOption === selectedQuestions[currentQuestion]?.answer) {
            setScore(score + 1);
        }
    }

    const resetAll = () => {
        setShowResult(false);
        setCurrentQuestion(0);
        setClickedOption(0);
        setScore(0);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='quiz'>
            <p className="heading-text">PRACTICE HERE!</p>
            <div className="container">
                {showResult ? (
                    <QUIZResult score={score} totalScore={10} tryAgain={resetAll} />
                ) : (
                    <>
                        <div className="question">
                            <span id='question-number'>{currentQuestion + 1}.</span>
                            <span id='question-txt'>{selectedQuestions[currentQuestion]?.question}</span>
                        </div>
                        <div className="option-container">
                            {
                                selectedQuestions[currentQuestion]?.options.map((option, i) => (
                                    <button
                                        className={`option-btn ${clickedOption === i + 1 ? "checked" : ""}`}
                                        key={i}
                                        onClick={() => setClickedOption(i + 1)}
                                    >
                                        {option}
                                    </button>
                                ))
                            }
                        </div>
                        <input type="button" value="Next" id='next-button' onClick={changeQuestion} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Quiz;
