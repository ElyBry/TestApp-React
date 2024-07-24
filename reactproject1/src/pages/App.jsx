// Главное меню
import '../App.css'; // Подключаем css
import {Link} from "react-router-dom"; // Подключаем компонент из библиотеки

const App = () => { // Создаём компнонент App, который отображает HTML код
    return (
        <>
        <div className="header">
            <Link to="/" className="headlink"><img src="logosdamexam.svg" className="main-image" /><span className="logotext">sdamexam</span></Link>
        </div>
        
        <div className="main">
            <img src="persege.svg" className="image" />
            <div className="buttons-container">
                <Link to="test" className="btn">Решить пробник</Link>
                <Link to="faq" className="btn">FAQ</Link>
            </div>
        </div>
        </>
    );
}

export default App; // Экспорт компонента App