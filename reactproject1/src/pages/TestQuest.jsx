import { useState } from 'react'; // Импортируем хук useState из библиотеки React для управления состоянием компонентов
import { Link, Route, Routes, useNavigate } from "react-router-dom"; // Импортируем компоненты Link, Route, Routes и хук useNavigate из библиотеки react-router-dom для навигации по приложению
import Tex2SVG from "react-hook-mathjax"; // Импортируем компонент Tex2SVG из библиотеки react-hook-mathjax для отображения математических формул в виде SVG

const App = () => { // Создаём компнонент App, который отображает основной HTML код
    return (
        <>
            <div className="header">
                <Link to="/" className="headlink"><img src="/logosdamexam.svg" className="main-image" /><span className="logotext">sdamexam</span></Link>
            </div>

            <div className="main">
                <Routes>
                    <Route path="/" element={<DynamicContent />} /> # При ссылке / выводит компонент DynamicContent(динамичный контент)
                </Routes>
            </div>
        </>
    );
}

const DynamicContent = () => { // Компонент DynamicContent, для изменения контента и его отображения
    const [CorrectAnsweredQuestions, setCorrectAnsweredQuestions] = useState({}); // Состояние для хранения объекта с номерами вопросов, на которые были даны правильные ответы
    const [answeredQuestions, setAnsweredQuestions] = useState({}); // Состояние для хранения объекта с номерами вопросов, на которые были даны ответы
    const [userAnswers, setUserAnswers] = useState({}); // Состояние для хранения объекта с ответами пользователя на вопросы
    const [showResult, setShowResult] = useState(false); // Состояние для отображения/скрытия результата теста

    let params = new URLSearchParams(window.location.search); // Получаем параметры из строки запроса URL
    let subject = params.get('subject'); // Извлекаем значение параметра 'subject' из строки запроса
    let id = params.get('id'); // Извлекаем значение параметра 'id' из строки запроса
    var Ocenka = 0; // Объявляем переменную Ocenka и инициализируем ее значением 0, возможно для подсчета оценки
    let question;
    const unHidden = () => { // используется после перехода с результатов теста в гл.меню
        document.querySelector("body").style.overflow = "auto"; // делаем возможность листать
        localStorage.setItem("count_tests", parseInt(localStorage.getItem("count_tests")) + 1); // в локальное хранилище запоминаем значение на 1 выше предыдущего
        localStorage.setItem("res_tests", parseInt(localStorage.getItem("res_tests")) + Ocenka); // в локальное хранилище запоминаем значение на Ocenka выше предыдущего
    }
    const Result = () => { // Для отображения результата
        window.scrollTo({ // Скролл в самый верх
            top: 0,
            behavior: "smooth"
        });
        document.querySelector("body").style.overflow = "hidden"; // Убираем возможность листать вправо вверх
        const ResCifr = Math.round(correctAnswers / totalQuestions * 100); // считаем процент верных ответов
        
        if (ResCifr >= 86) { // если процент больше либо равен 86 то
            Ocenka = 5; // Оценка 5
        } else if (ResCifr >= 71) { // если процент больше либо равен 71 то
            Ocenka = 4; // Оценка 4
        } else if (ResCifr >= 55) { // если процент больше либо равен 55 то
            Ocenka = 3; // Оценка 3
        } else { // если процент больше меньше 55 то
            Ocenka = 2; // Оценка 2
        }
        
        return ( 
            <div className="resultTest"> 
                <div className="obRes">
                <div className="resMain">
                    Вы сдали тест на {correctAnswers} из {totalQuestions}.
                </div>
                    <div className="resPerc">В процентном соотношении это {ResCifr}%.<br></br> Оценка: {Ocenka }</div>
                </div>
                <Link to="/" className="btn" onClick={() => unHidden()}>Вернуться в главное меню</Link>
            </div>
        );
    }
    const questionsPerSubject = { // Словарь где по ключам(предметы) находятся кол-во вопросов
        "Русский язык": 6,
        "Математика": 4,
        "Обществознание": 6,
        "Информатика": 6,
        "Английский язык": 6,
    };
    const totalQuestions = questionsPerSubject[subject]; // запоминаем к-во вопросов с помощью ключа(предмета)
    const questionNumbers = Array.from({ length: totalQuestions }, (_, index) => index + 1); // создаём массив по длине всех вопросов от 1 до totalQuestions
    const endTest = () => { // Компонент проверяющий все ли вопросы отвечены
        const answeredQuestionIds = Object.keys(userAnswers);
        checkAnswer(document.getElementById("answer").value);
        if (answeredQuestionIds.length === totalQuestions && !answeredQuestionIds.some(id => userAnswers[id] === "")) {
            setShowResult(true); // запуск компонента показывающего результат
        } else {
            alert("Вы не ответили на все вопросы или некоторые ответы пустые");
        }
    };
    const handleNavigate = (newId) => { // компонент для перехода между вопросами
        if (newId > 0 && newId <= questionNumbers.length) { // ограничения, чтобы не выйти за пределы 
            checkAnswer(document.getElementById("answer").value); // проверяем ответ
            navigate(`/oge/testquest?subject=${subject}&id=${newId}`); // меняем ссылку
            document.getElementById("answer").value = ""; //обнуляем поле с ответом
            if (newId === questionNumbers.length) { // если последний вопрос
                document.getElementById("endbttn").style.display = "block"; // То показываем кнопку завершить
            } else {
                document.getElementById("endbttn").style.display = "none"; // скрываем кнопку завершить
            }
        }
    };
    const [correctAnswers, setCorrectAnswers] = useState(0); // Инициализация состояния `correctAnswers` с начальным значением 0 с помощью хука useState
    const navigate = useNavigate(); // Получение функции навигации из React Router с помощью хука useNavigate
    const checkAnswer = (answer) => {
        let params = new URLSearchParams(window.location.search); // Получаем параметры из строки запроса URL
        let subject = params.get('subject'); // Извлекаем значение параметра 'subject' из строки запроса
        let id = params.get('id'); // Извлекаем значение параметра 'id' из строки запроса
        let correctAnswer;

        switch (subject) { // Выбор предмета
            case 'Русский язык': 
                switch (id) { // Выбор вопроса
                    case '1':
                        correctAnswer = '235'; // Верный ответ
                        break;
                    case '2':
                        correctAnswer = '15';
                        break;
                    case '3':
                        correctAnswer = '45';
                        break;
                    case '4':
                        correctAnswer = '24';
                        break;
                    case '5':
                        correctAnswer = '45';
                        break;
                    case '6':
                        correctAnswer = '35';
                        break;
                    default:
                        correctAnswer = '123GHJKGHKJDSHJKH123';
                        break;
                }
                break;
            case 'Математика':
                switch (id) {
                    case '1':
                        correctAnswer = '81';
                        break;
                    case '2':
                        correctAnswer = '0,5604';
                        break;
                    case '3':
                        correctAnswer = '0,000196';
                        break;
                    case '4':
                        correctAnswer = '2';
                        break;
                    default:
                        correctAnswer = '123GHJKGHKJDSHJKH123';
                        break;
                }
                break;
            case 'Обществознание':
                switch (id) {
                    case '1':
                        correctAnswer = '1';
                        break;
                    case '2':
                        correctAnswer = '3';
                        break;
                    case '3':
                        correctAnswer = '4';
                        break;
                    case '4':
                        correctAnswer = '2';
                        break;
                    case '5':
                        correctAnswer = '4';
                        break;
                    case '6':
                        correctAnswer = '1';
                        break;
                    default:
                        correctAnswer = '123GHJKGHKJDSHJKH123';
                        break;
                }
                break;
            case 'Информатика':
                switch (id) {
                    case '1':
                        correctAnswer = '15';
                        break;
                    case '2':
                        correctAnswer = 'ягуар';
                        break;
                    case '3':
                        correctAnswer = 'Долгопёр';
                        break;
                    case '4':
                        correctAnswer = 'кереки';
                        break;
                    case '5':
                        correctAnswer = 'тыква';
                        break;
                    case '6':
                        correctAnswer = 'грач';
                        break;
                    default:
                        correctAnswer = '123GHJKGHKJDSHJKH123';
                        break;
                }
                break;
            case 'Английский язык':
                switch (id) {
                    case '1':
                        correctAnswer = 'younger';
                        break;
                    case '2':
                        correctAnswer = 'our way';
                        break;
                    case '3':
                        correctAnswer = `didn't like`;
                        break;
                    case '4':
                        correctAnswer = 'was reading';
                        break;
                    case '5':
                        correctAnswer = 'could not';
                        break;
                    case '6':
                        correctAnswer = 'to me';
                        break;
                    default:
                        correctAnswer = '123GHJKGHKJDSHJKH123';
                        break;
                }
                break;
        }
        if (answer === correctAnswer && (CorrectAnsweredQuestions[id] == 0 || !CorrectAnsweredQuestions[id])) {
            setCorrectAnswers(correctAnswers + 1); // Увеличиваем количество правильных ответов на 1
            setCorrectAnsweredQuestions({ ...CorrectAnsweredQuestions, [id]: 1 }); // Обновляем состояние с информацией о правильных ответах на вопрос с указанным ID
        }
        if (answer !== correctAnswer && CorrectAnsweredQuestions[id] == 1) {
            setCorrectAnswers(correctAnswers - 1); // Уменьшаем количество правильных ответов на 1
            setCorrectAnsweredQuestions({ ...CorrectAnsweredQuestions, [id]: 0 }); // Обновляем состояние, убирая правильный ответ для вопроса с указанным ID
        }
        setUserAnswers({ ...userAnswers, [id]: answer }); // Сохраняем ответ пользователя на вопрос с указанным ID
        if (document.getElementById("answer").value !== "") {
            setAnsweredQuestions({ ...answeredQuestions, [id]: true }); // Отмечаем, что вопрос с указанным ID был отвечен
        }
    };
    switch (subject) { // Выбор предмета
        case 'Русский язык':
            switch (id) {
                case '1': // Выбор вопроса
                    question = `Прочитайте текст и выполните задание.
(1)Современный человек испытывает жесточайшее давление не только со стороны моды, но и в нравственном плане. (2)Отрекаясь от собственного мнения, современники отказываются и от собственного нравственного выбора. (3) Они должны признать хорошим то, что общество словом и делом выдает за таковое, и осудить то, что оно объявляет дурным. (4)При этом они пытаются подавлять рождающиеся в душе сомнения, не проявляя их ни перед другими, ни перед самими собой. (5)В результате нравственность человека оказывается подчинена требованиям масс.
Укажите варианты ответов, в которых верно определена грамматическая основа в одном из предложений или в одной из частей сложного.
1)  испытывает давление (предложение 1).
2)  современники отказываются (предложение 2).
3)  общество выдает (предложение 3).
4)  они пытаются (предложение 4).
5)  нравственность оказывается подчинена (предложение 5).`;
                    break;
                case '2':
                    question = `Орфографический анализ.
Укажите варианты ответов, в которых дано верное объяснение написания выделенного слова. Запишите номера этих ответов.
1)  РАССТАВЛЯТЬ  — на конце приставки перед буквой, обозначающей глухой согласный звук, пишется буква С.
2)  РЕШЕНА (задача)  — в краткой форме имени прилагательного пишется столько же Н, сколько и в полной форме этого прилагательного.
3)  ПРИКАСАТЬСЯ  — написание безударной чередующейся гласной в корне слова зависит от его лексического значения.
4)  (устал от) НЕУДАЧ  — в форме множественного числа имени существительного 3-го склонения после шипящего буква Ь не пишется.
5)  (объяснялся) ПО-НЕМЕЦКИ  — наречие пишется через дефис, потому что оно образовано от основы имени прилагательного при помощи приставки ПО- и суффикса -И.`;
                    break;
                case '3':
                    question = `Орфографический анализ.
Укажите варианты ответов, в которых дано верное объяснение написания выделенного слова.Запишите номера этих ответов.
1) ПРИВОКЗАЛЬНАЯ(площадь)  — Приставка ПРИ - пишется в значении неполноты действия.
2) ГРУЖЁНАЯ(БАРЖА)  — в суффиксе причастия пишется одна - Н -.
3) ПРИЛАГАТЬ(усилия)  — написание безударной чередующейся гласной в корне слова зависит от ударения.
4) (усыпана) СПЛОШЬ  — на конце наречий после шипящего буква Ь пишется.
5) (снег) БЕЛЫЙ - БЕЛЫЙ  — сложные имена прилагательные, образованные повторением одинаковых слов, пишутся через дефис.`;
                    break;
                case '4':
                    question = `Орфографический анализ.

Укажите варианты ответов, в которых дано верное объяснение написания выделенного слова.Запишите номера этих ответов.
1)  НЕ ВЫПОЛНЕННОЕ(вовремя задание)  — НЕ с прилагательным пишется раздельно, потому что нельзя заменить слово синонимом.
2) ЧУГУННОЕ(литьё)  — в прилагательном, образованном от существительного с основой на - Н, с помощью суффикса - Н - пишется - НН - на стыке морфем.
3) ЗАСТЕЛИТЬ(постель)  — написание безударной чередующейся гласной в корне слова зависит от значения.
4) (кофе) ГОРЯЧ  — на конце кратких прилагательных после шипящего буква Ь не пишется.
5) (повернули на) ЮГО - ВОСТОК  — сложные имена прилагательные, образованные повторением слов, пишутся через дефис.`;
                    break;
                case '5':
                    question = `Орфографический анализ.

Укажите варианты ответов, в которых дано верное объяснение написания выделенного слова. Запишите номера этих ответов.
1)  ПРОКОПАЕТ (траншею)  — в безударном положении в окончании глагола пишется Е, потому что это глагол-исключение.
2)  (ведёт себя) РАСКОВАННО  — в кратком прилагательном пишется -НН-.
3)  ЗАГОРАТЬ (на пляже)  — написание безударной чередующейся гласной в корне слова зависит от суффикса.
4)  (хорошо) РИСУЕШЬ  — на конце глагола после шипящего буква Ь пишется.
5)  (кофе) ПО-ВОСТОЧНОМУ  — Наречия на -ОМУ с приставкой ПО- пишутся через дефис.`;
                    break;
                case '6':
                    question = `Орфографический анализ.
Укажите варианты ответов, в которых дано верное объяснение написания выделенного слова. Запишите номера этих ответов.
1)  ВЗБУДОРАЖЕНЫ (известием)  — на конце приставки перед буквой, обозначающей глухой согласный звук, пишется буква З.
2)  ОРГАНИЗАЦИОННЫЙ (момент)  — в причастии пишется -НН-.
3)  МАКАТЬ (перо в чернильницу)  — написание безударной чередующейся гласной в корне слова зависит от значения корня.
4)  (нет) ТУЧ  — на конце существительного 3 склонения после шипящего буква Ь не пишется.
5)  ЖЕЛЕЗНОДОРОЖНЫЙ (состав)  — Прилагательные, образованные на основе подчинительного словосочетания, пишутся слитно.`;
                    break;
                default:
                    question = 'Вопрос не найден';
                    break;
            }
            break;
        case 'Математика':
            switch (id) {
                case '1':
                    question = (
                        <div>Найдите значение выражения
                            <div>
                                <p> <Tex2SVG display="inline" latex="\frac{3^8*3^5}{3^9}" /></p>
                            </div>
                        </div>);
                    break;
                case '2':
                    question = (
                        <div>Найдите значение выражения
                            <div>
                                <p> <Tex2SVG display="inline" latex="5*10^{-1} + 6*10^{-2} + 4*10^{-4}" /></p>
                            </div>
                        </div>);
                    break;
                case '3':
                    question = (
                        <div>Найдите значение выражения
                            <div>
                                <p> <Tex2SVG display="inline" latex="(4,9 * 10^{-3})(4*10^{-2})" /></p>
                            </div>
                        </div>);
                    break;
                case '4':
                    question = (
                        <div>Какое из следующих неравенств <strong>не</strong> следует из неравенства ? <br></br><Tex2SVG display="inline" latex="y - x > z" /><br></br>
                            В ответе укажите номер правильного варианта.
                            <div>
                                <p>1) <Tex2SVG display="inline" latex="y > z + x" /></p>
                                <p>2) <Tex2SVG display="inline" latex="y - x - z < 0" /></p>
                                <p>3) <Tex2SVG display="inline" latex="z + x - y < 0" /></p>
                                <p>4) <Tex2SVG display="inline" latex="y - z > x" /></p>
                            </div>
                        </div>);
                    break;
                default:
                    question = 'Вопрос не найден';
                    break;
            }   
            break;
        case 'Английский язык':
            switch (id) {
                case '1':
                    question = `Прочитайте приведенный ниже текст. Преобразуйте слово, напечатанное заглавными буквами в скобках так, чтобы оно грамматически соответствовало содержанию текста. Заполните пропуск полученным словом.
«I was sixteen and she was four years ____________(YOUNG) than me...»`;
                    break;
                case '2':
                    question = `Прочитайте приведенный ниже текст. Преобразуйте слово, напечатанное заглавными буквами в скобках так, чтобы оно грамматически соответствовало содержанию текста. Заполните пропуск полученным словом.
«...but we had a lot in common and enjoyed chatting on ____________(WE) way to school.»`;
                    break;
                case '3':
                    question = `Прочитайте приведенный ниже текст. Преобразуйте слово, напечатанное заглавными буквами в скобках так, чтобы оно грамматически соответствовало содержанию текста. Заполните пропуск полученным словом.
«Every morning Kitty knocked on my door and I had to be ready by that time  — she ____________(NOT LIKE) waiting for me. One day she didn't knock.»`;
                    break;
                case '4':
                    question = `Прочитайте приведенный ниже текст. Преобразуйте слово, напечатанное заглавными буквами в скобках так, чтобы оно грамматически соответствовало содержанию текста. Заполните пропуск полученным словом.
«When I caught up with her at the bus stop, she ___________(READ) a magazine and didn't even look at me.»`;
                    break;
                case '5':
                    question = `Прочитайте приведенный ниже текст. Преобразуйте слово, напечатанное заглавными буквами в скобках так, чтобы оно грамматически соответствовало содержанию текста. Заполните пропуск полученным словом.
«I ___________(NOT CAN) understand what was going on.»`;
                    break;
                case '6':
                    question = `Прочитайте приведенный ниже текст. Преобразуйте слово, напечатанное заглавными буквами в скобках так, чтобы оно грамматически соответствовало содержанию текста. Заполните пропуск полученным словом.
«"Hey, Kitty, what's wrong? Why aren't you talking to___________(I)?" "You yourself know why," Kitty said angrily. "No, I don't."»`;
                    break;
                default:
                    question = 'Вопрос не найден';
                    break;
            }
            break;
        case 'Обществознание':
            switch (id) {
                case '1':
                    question = `Существует несколько значений понятия «экономика». Что иллюстрирует экономику как хозяйство?
                    1)  открытие сети продовольственных гипермаркетов
                    2)  объяснение причин роста инфляции
                    3)  расчет показателей государственного бюджета
                    4)  прогнозирование спроса на товары`;
                    break;
                case '2':
                    question = `Какой признак отличает традиционную экономику?
                    1)  процветание фабричного производства
                    2)  централизованное ценообразование
                    3)  регулирование производства при помощи обычаев
                    4)  преобладание частной собственности на средства производства`;
                    break;
                case '3':
                    question = `Что из перечисленного характеризует рыночную экономику?
                                1)  государственное регулирование ценообразования
                                2)  диктат хозяйственного опыта предков
                                3)  плановая организация производства
                                4)  многообразие форм собственности`;
                    break;
                case '4':
                    question = `Существует несколько значений понятия «экономика». Что иллюстрирует экономику как науку?
                                1)  продажа продукции фермерских хозяйств
                                2)  выявление факторов роста спроса на услуги
                                3)  оказание населению бытовых услуг
                                4)  биржевые торги акциями предприятий`;
                    break;
                case '5':
                    question = `Готовность покупателей приобрести товар или услугу по определенной цене  — это
                                1)  предложение
                                2)  номинальная стоимость
                                3)  прибыль
                                4)  спрос`;
                    break;
                case '6':
                    question = `Существует несколько значений понятия «экономика». Что иллюстрирует экономику как хозяйство?
                                1)  открытие сети продовольственных гипермаркетов
                                2)  объяснение причин роста инфляции
                                3)  расчет показателей государственного бюджета
                                4)  прогнозирование спроса на товары`;
                    break;
                default:
                    question = 'Вопрос не найден';
                    break;
            }
            break;
        case 'Информатика':
            switch (id) {
                case '1':
                    question = `Рассказ, набранный на компьютере, содержит 8 страниц, на каждой странице 40 строк, в каждой строке 48 символов. Определите информационный объем рассказа в Кбайтах в кодировке Windows, в которой каждый символ кодируется 8 бит.`;
                    break;
                case '2':
                    question = `В одной из кодировок Unicode каждый символ кодируется 16 битами. Ваня написал текст (в нем нет лишних пробелов):
«Лев, тигр, ягуар, гепард, пантера, ягуарунди  — кошачьи».
Ученик вычеркнул из списка название одного из представителей семейства кошачьих. Заодно он вычеркнул ставшие лишними запятые и пробелы  — два пробела не должны идти подряд.
При этом размер нового предложения в данной кодировке оказался на 14 байт меньше, чем размер исходного предложения. Напишите в ответе вычеркнутое название представителя семейства кошачьих.`;
                    break;
                case '3':
                    question = `В кодировке КОИ-8 каждый символ кодируется 8 битами. Аня написала текст (в нем нет лишних пробелов):
«ерш, Щука, Бычок, Карась, Гимнура, Долгопер  — рыбы».
Ученик вычеркнул из списка название одной из рыб. Заодно он вычеркнул ставшие лишними запятые и пробелы  — два пробела не должны идти подряд.
При этом размер нового предложения в данной кодировке оказался на 10 байтов меньше, чем размер исходного предложения. Напишите в ответе вычеркнутое название рыбы.`;
                    break;
                case '4':
                    question = `В кодировке UTF-32 каждый символ кодируется 32 битами. Костя написал текст (в нем нет лишних пробелов):
«Бай, аэта, волоф, кереки, киргизы, норвежцы  — народы».
Ученик вычеркнул из списка название одного из народов. Заодно он вычеркнул ставшие лишними запятые и пробелы  — два пробела не должны идти подряд.
При этом размер нового предложения в данной кодировке оказался на 32 байта меньше, чем размер исходного предложения. Напишите в ответе вычеркнутое название народа.`;
                    break;
                case '5':
                    question = `В кодировке UTF-32 каждый символ кодируется 32 битами. Саша написал текст (в нем нет лишних пробелов):
«Мята, тыква, фасоль, артишок, патиссон, лагенария  — овощи».
Ученик вычеркнул из списка название одного из овощей. Заодно он вычеркнул ставшие лишними запятые и пробелы  — два пробела не должны идти подряд.
При этом размер нового предложения в данной кодировке оказался на 28 байтов меньше, чем размер исходного предложения. Напишите в ответе вычеркнутое название овоща.`;
                    break;
                case '6':
                    question = `В одной из кодировок Unicode каждый символ кодируется 16 битами. Вова написал текст (в нем нет лишних пробелов):
«Чиж, грач, стриж, гагара, пингвин, ласточка, жаворонок, свиристель, буревестник, вертиголовка  — птицы».
Ученик вычеркнул из списка название одной птицы. Заодно он вычеркнул ставшие лишними запятые и пробелы  — два пробела не должны идти подряд. При этом размер нового предложения в данной кодировке оказался на 12 байт меньше, чем размер исходного предложения. Напишите в ответе вычеркнутое название птицы.`;
                    break;
                default:
                    question = 'Вопрос не найден';
                    break;
            }
            break;
    }
    

    
    return ( // Отображаемый контент
        <>  {showResult ? <Result correctAnswers={correctAnswers} totalQuestions={totalQuestions} /> : null} 
            <div className="numberquestion">{subject}<br></br> {id}</div>
            <div className="question">{question}</div>
            <input id="answer" className="answer" autoComplete="off" type="text" placeholder="ответ" value={userAnswers[id] ? userAnswers[id] : ''} onChange={(e) => setUserAnswers({ ...userAnswers, [id]: e.target.value })}></input>
            <div id="endbttn">
                <button id="endbutton" onClick={() => endTest()} className="end">Завершить тест</button>
            </div>
            <div className="strel">
                <div className="leftstr" onClick={() => handleNavigate(parseInt(id) - 1)}><img src="/leftstr.svg" /></div>
                <div className="rightstr" onClick={() => handleNavigate(parseInt(id) + 1)}><img src="/rightstr.svg" /></div>
            </div>
            <div className="allquestions">
                {questionNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => handleNavigate(number)}
                        className={`numquest ${answeredQuestions[number] ? 'answered' : ''}`}
                    >
                        {number}
                    </button>
                ))}
            </div>
            
        </>
    );
}




export default App; // Экспорт компонента App