import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAnswer } from '../store/pageSlice';
import styles from '../style/Question.module.css';
import { Question as QuestionType } from '../types';

interface QuestionProps {
    question: QuestionType;
}

export default function Question({ question }: QuestionProps) {
    const dispatch = useDispatch();
    const answer = useSelector((state: RootState) => state.page.answers[question.id]);

    const handleAnswerChange = (answer: string) => {
        dispatch(setAnswer({ questionId: question.id, answer }));
    };

    return (
        <div className={styles.question}>
            <h3>{question.text}</h3>
            <div className={styles.buttonGroup}>
                <button
                    className={`${styles.optionButton} ${answer === 'yes' ? styles.selected : ''}`}
                    onClick={() => handleAnswerChange('yes')}
                >
                    {question.options.yes}
                </button>
                <button
                    className={`${styles.optionButton} ${answer === 'no' ? styles.selected : ''}`}
                    onClick={() => handleAnswerChange('no')}
                >
                    {question.options.no}
                </button>
            </div>
        </div>
    );
}