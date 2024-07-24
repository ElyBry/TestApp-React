// Выбор класса
import '../App.css'; // Подключаем CSS файл для стилизации компонентов
import { Link } from "react-router-dom"; // Импортируем компонент Link из библиотеки react-router-dom

const App = () => { // Создаём компнонент App
    var ResPerc = 0; // ResPerc - Средний балл
    if (localStorage.getItem("count_tests") != 0) { // Исключаем деление на 0 с помощью этого условия
        var ResPerc = Math.round(localStorage.getItem("res_tests") / localStorage.getItem("count_tests")); // если кол-во решенных тестов не равно 0 то считает средний балл
    }
    
    return ( 
        <>
            <div className="header">
                <Link to="/" className="headlink"><img src="logosdamexam.svg" className="main-image" /><span className="logotext">sdamexam</span></Link>
            </div>

            <div className="main">
                <div className="fst_block">
                    <div className="avatar"><img src="avatar.png" /></div>
                    <div className="results">
                        <div className="result">
                            <span className="zresult">решено тестов </span>
                            <span className="cresult">{localStorage.getItem("count_tests")}</span>
                        </div>
                        <div className="result">
                            <span className="zresult">средний балл </span>
                            <span className="cresult">{ResPerc}</span>
                        </div>
                    </div>
                </div>
                <div className="sc_block">
                    <div className="img_left"><img src="books.svg" /></div>
                    <div className="right_block">
                        <Link to="/mlad_klass" className="btn">1-9 класс</Link>
                        <Link to="/pickitemoge" className="btn">Огэ</Link>
                        <Link to="/pickitemege" className="btn">Егэ</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App; // Экспорт компонента App