import { load_questions } from "./database.js";
import { userID } from "./login.js";
import { userQuestions, questionLibrary, generatedQuestions } from "./database.js";

export let jobTitle = '';
export let experience = '';

const loginWidget = document.getElementById('login-widget');
const loginPage = document.getElementById('login-page');
const mainScreen = document.getElementById('main-screen');
const userQuestionsWindow = document.getElementById('user-questions-window');
const questionLibraryWindow = document.getElementById('question-library-window');
const generatedQuestionsWindow = document.getElementById('generated-questions-window');
const actions = document.getElementById('actions');
const moreActions = document.getElementById('more-actions');
const submitDetails = document.getElementById('submit-details');

export function updateQuestions() {
    if (userQuestions && userQuestions.length > 0) {
        userQuestionsWindow.innerHTML = '';
    } else {
        userQuestionsWindow.innerHTML = '<p>No questions added yet, try some common questions or generate customized ones!</p>';
    }
    if (questionLibrary && questionLibrary.length > 0) {
        questionLibraryWindow.innerHTML = '';
    } else {
        questionLibraryWindow.innerHTML = '<p>No questions available in the Library, ask the assitant to generate some!</p>';
    }
    if (generatedQuestions && generatedQuestions.length > 0) {
        generatedQuestionsWindow.innerHTML = '';
    } else {
        generatedQuestionsWindow.innerHTML = '<p>No questions here yet, click on the generate button to add questions!</p>';}
    for (const question of userQuestions) {
        userQuestionsWindow.innerHTML += `
            <input type="checkbox" class="butt btn-check butt" id="${question.question_id}" autocomplete="off">
            <label class="butt btn" for="${question.question_id}">${question.question_text}</label>        
            `;
        }
    for (const question of questionLibrary) {
        questionLibraryWindow.innerHTML += `
            <input type="checkbox" class="btn-check" id="${question.question_id}" autocomplete="off">
            <label class="btn butt" for="${question.question_id}">${question.question_text}</label>        
            `;
    }
    for (const question of generatedQuestions) {
        generatedQuestionsWindow.innerHTML += `
            <input type="checkbox" class="btn-check" id="${question.question_id}" autocomplete="off">
            <label class="btn butt" for="${question.question_id}">${question.question_text}</label>        
            `;
    }
}

document.querySelectorAll('.btn-check').forEach(checkbox => {
    checkbox.addEventListener('click', () => {
        const image = document.getElementById('actionImage');
        image.classList.remove('hidden');
    });
});

function launchMainScreen() {
    mainScreen.classList.remove('hidden');
    actions.classList.remove('hidden');
    moreActions.classList.remove('hidden');
    actions.classList.add('animate__animated', 'animate__fadeInRight');
    moreActions.classList.add('animate__animated', 'animate__fadeInRight');
    mainScreen.classList.add('animate__animated', 'animate__fadeInDown');
}

export async function loginSuccess () {
    loginWidget.classList.remove('animate__animated', 'animate__fadeInDown');
    loginWidget.classList.add('animate__animated', 'animate__backOutDown');
    launchMainScreen();

    loginWidget.addEventListener('animationend', () => {
        loginPage.style.display = 'none';

    });
    await load_questions();
    updateQuestions();
}

submitDetails.addEventListener('click', async (e) => {
    e.preventDefault();
    const detailsForm = document.getElementById('details-form');
    if (detailsForm) {
        const jobTitleElement = detailsForm.elements['job-title'];
        const experienceElement = detailsForm.elements['experience'];
        const rememberMeElement = detailsForm.elements['remember-me'];

        jobTitle = jobTitleElement ? jobTitleElement.value : '';
        experience = experienceElement ? experienceElement.value : '';
        const rememberMe = rememberMeElement ? rememberMeElement.checked : false;
    } else {
        console.error('Form not found');
    }
});