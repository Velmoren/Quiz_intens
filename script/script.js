'use strict';

//Обработчик событий, скрипт будет загружаться только после загрузки html документа
document.addEventListener('DOMContentLoaded', function() {
   const btnOpenModal = document.querySelector('#btnOpenModal');
   const modalBlock = document.querySelector('#modalBlock');
   const closeModal = document.querySelector('#closeModal');
   const questionTitle = document.querySelector('#question');
   const formAnswers = document.querySelector('#formAnswers');
   const burgerMenu = document.querySelector('#burgerMenu');
   const prevButton = document.querySelector('#prev');
   const nextButton = document.querySelector('#next');
   const modalDialog = document.querySelector('.modal-dialog');
   const sendButton = document.querySelector('#send');
   const modalTitle = document.querySelector('.modal-title');

//Содержит в себе элементы для вопросов
   const questions = [
      {
         question: "Какого цвета бургер?",
         answers: [
            {
               title: 'Стандарт',
               url: './image/burger.png'
            },
            {
               title: 'Черный',
               url: './image/burgerBlack.png'
            }
         ],
         type: 'radio'
      },
      {
         question: "Из какого мяса котлета?",
         answers: [
            {
               title: 'Курица',
               url: './image/chickenMeat.png'
            },
            {
               title: 'Говядина',
               url: './image/beefMeat.png'
            },
            {
               title: 'Свинина',
               url: './image/porkMeat.png'
            }
         ],
         type: 'radio'
      },
      {
         question: "Дополнительные ингредиенты?",
         answers: [
            {
               title: 'Помидор',
               url: './image/tomato.png'
            },
            {
               title: 'Огурец',
               url: './image/cucumber.png'
            },
            {
               title: 'Салат',
               url: './image/salad.png'
            },
            {
               title: 'Лук',
               url: './image/onion.png'
            }
         ],
         type: 'checkbox'
      },
      {
         question: "Добавить соус?",
         answers: [
            {
               title: 'Чесночный',
               url: './image/sauce1.png'
            },
            {
               title: 'Томатный',
               url: './image/sauce2.png'
            },
            {
               title: 'Горчичный',
               url: './image/sauce3.png'
            }
         ],
         type: 'radio'
      }
   ];


// Установка анимации для модального окна.
// Окно плавно спускается с верхнего края экрана
   let count = -100;
   let interval;
   modalDialog.style.top = count + `%`;

   const animateModal = () => {
      modalDialog.style.top = count + `%`;
      count += 1.5;
      interval = requestAnimationFrame(animateModal);

      if (count > 0) {
         cancelAnimationFrame(interval);
         count = -100;
      }
   }


   burgerMenu.style.display = "none";
//Присваиваем в переменную ширину экрана при загрузке страницы
   let clientWidth = document.documentElement.clientWidth; 
   
   if (clientWidth < 768) {
      burgerMenu.style.display = "flex";
   } else {
      burgerMenu.style.display = "none";
   }

   window.addEventListener('resize', function() {
      clientWidth = document.documentElement.clientWidth;

      if (clientWidth < 768) {
         burgerMenu.style.display = "flex";
      } else {
         burgerMenu.style.display = "none";
      }
   }) //Событие отслеживает изменение размера окна

   burgerMenu.addEventListener('click',() => {
      burgerMenu.classList.add("active");
      modalBlock.classList.add('d-block');
      playTest();
   });




//Открытие и закрытие модального окна
   btnOpenModal.addEventListener('click',() => {
      interval = requestAnimationFrame(animateModal);
      modalBlock.classList.add('d-block');
      playTest();
   });
   closeModal.addEventListener('click', () => {
      modalBlock.classList.remove('d-block');
      burgerMenu.classList.remove("active");
   });

//Закрттие модального окна через клик вне окна
document.addEventListener('click',(event) => {
   if (
      !event.target.closest('.modal-dialog') && 
      !event.target.closest('#btnOpenModal') &&
      !event.target.closest('#burgerMenu')
      ){
      modalBlock.classList.remove('d-block');
      burgerMenu.classList.remove("active");
      cancelAnimationFrame(interval);
      count = -100;
   }
});

//Запуск теста по нажатию на кнопку
   const playTest = () => {
      const obj = {};
      const finalAnswers = [] ;
      let numberQuestion = 0;
      modalTitle.textContent = "Ответьте на вопросы"
//Функция рендера  ответов из переменной выше
      const renderAnswers = (index) => {
         questions[index].answers.forEach((answer) => {
            const answerItem = document.createElement('div');

            answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
            answerItem.innerHTML = `
            <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
               <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                  <img class="answerImg" src="${answer.url}" alt="burger">
                  <span>${answer.title}</span>
               </label>
               `;
            formAnswers.appendChild(answerItem);
         });
      };
//Функция чтения вопросов из переменной выше и вызов функции рендера ответов
      const renderQuestions = (indexQuestion) => {
         formAnswers.innerHTML = '';
         switch(true) {
            case (numberQuestion === 0):
               questionTitle.textContent = `${questions[indexQuestion].question}`;
               renderAnswers(indexQuestion);
               prevButton.classList.add('d-none');
               break;
            case (numberQuestion >= 0 && numberQuestion <= questions.length - 1):
               questionTitle.textContent = `${questions[indexQuestion].question}`;
               renderAnswers(indexQuestion);
               nextButton.classList.remove('d-none');
               prevButton.classList.remove('d-none');
               sendButton.classList.add('d-none');
               nextButton.textContent = "Вперёд";
               prevButton.textContent = "Назад";
               console.log(numberQuestion);
               break;
            case (numberQuestion === questions.length):
               modalTitle.textContent = '';
               nextButton.classList.add('d-none');
               sendButton.classList.remove('d-none');
               sendButton.textContent = "Отправить";
               prevButton.textContent = "Изменить выбор";
               questionTitle.textContent = "Отличный выбор! Оставьте данные для связи";
               formAnswers.innerHTML = `
                  <div class="form-group">
                     <label for="numberPhone">Введите номер телефона для связи</label>
                     <input type="phone" class="form-control" id="numberPhone">
                  </div>
               `;

               const numberPhone = document.getElementById('numberPhone');
               numberPhone.addEventListener('input', (event) => {
                  event.target.value = event.target.value.replace(/[^0-9+-]/, "")
               });

               break;
            case (numberQuestion === questions.length + 1):
               questionTitle.textContent = "Мы скоро свяжемся с вами";
               formAnswers.textContent = "Спасибо за пройденный тест!";
               sendButton.classList.add('d-none');
               prevButton.classList.add('d-none');

               for (let key in obj) {
                  let newObj = {};
                  newObj[key] =obj[key];
                  formAnswers.push(newObj)
               }

               setTimeout(() => {
                  modalBlock.classList.remove('d-block');
               }, 5000);
               break;
         }
      };

      const checkAnswer = () => {
         
         const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');
         inputs.forEach((input, index) => {
            switch(true) {
               case (numberQuestion >= 0 && numberQuestion <= questions.length - 1):
                  obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                  break;
               case (numberQuestion === questions.length):
                  obj[`Номер телефона`] = input.value;
                  break;
            }
         })
      }
      //Запускаем функцию 
      renderQuestions(numberQuestion);
      
//Функционал для кнопок <- и ->
      nextButton.onclick = () => {
         checkAnswer();
         numberQuestion++;
         renderQuestions(numberQuestion);
      };
      prevButton.onclick = () => {
         numberQuestion--;
         renderQuestions(numberQuestion);
      };
      sendButton.onclick = () => {
         checkAnswer();
         numberQuestion++;
         renderQuestions(numberQuestion);
      };
   };

   


})
//Помещая код в document.addEventListener 'DOMContentLoaded'
//Остальной скрипт запустится только после полной загрузки DOM дерева




