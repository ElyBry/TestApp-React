// Предметы 1-9 классов
import '../App.css'; // Подключаем CSS файл для стилизации компонентов
import { Link } from "react-router-dom";  // Импортируем компонент Link из библиотеки react-router-dom

const App = () => { // Создаём компнонент App, который отображает HTML код
    return (
        <>
            <div className="header">
                <Link to="/" className="headlink"><img src="logosdamexam.svg" className="main-image" /><span className="logotext">sdamexam</span></Link>
            </div>

            <div className="main">
                <div className="fst_block_it">
                    <div className="zblock">предметы</div>
                </div>
                <div className="sc_block_it">
                    <div className="btnsitem">
                        <Link to="/cl/TestQuest?subject=Русский язык&id=1" className="btn">Русский язык</Link>
                        <Link to="/cl/TestQuest?subject=Обществознание&id=1" className="btn">Обществознание</Link>
                        <Link to="/cl/TestQuest?subject=Математика&id=1" className="btn">Математика</Link>
                        <Link to="/cl/TestQuest?subject=Информатика&id=1" className="btn">Информатика</Link>
                        <Link to="/cl/TestQuest?subject=Английский язык&id=1" className="btn">Английский язык</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App; // Экспорт компонента App