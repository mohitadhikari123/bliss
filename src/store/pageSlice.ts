import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageState, Page } from '@/types';

const initialState: PageState = {
    pages: [],
    currentPageIndex: 0,
    answers: {},
};

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setPages: (state, action: PayloadAction<Page[]>) => {
            state.pages = action.payload;
        },
        setCurrentPageIndex: (state, action: PayloadAction<number>) => {
            state.currentPageIndex = action.payload;
        },
        setCurrentPageById: (state, action: PayloadAction<string>) => {
            const index = state.pages.findIndex(page => page.id === action.payload);
            if (index !== -1) {
                state.currentPageIndex = index;
            }
        },
        setAnswer: (state, action: PayloadAction<{ questionId: string; answer: string }>) => {
           
            state.answers[action.payload.questionId] = action.payload.answer ;

        },
        emptyAnswers: (state) => {

        state.answers = {};
        
    },
        
    },
});

export const { setPages, setCurrentPageIndex, setCurrentPageById, setAnswer ,emptyAnswers} = pageSlice.actions;
export default pageSlice.reducer;