import { BrowserRouter, Routes, Route } from "react-router-dom"; // Импортируем компоненты для роутинга из react-router-dom

import Main from "./pages/App.jsx"; // Импортируем компонент для главной страницы
import Faq from "./pages/Faq.jsx"; // Импортируем компонент для страницы FAQ
import TestPicker from "./pages/TestPicker.jsx"; // Импортируем компонент для выбора тестов
import TestItemOge from "./pages/TestItemOge.jsx"; // Импортируем компонент для теста по ОГЭ
import TestItemEge from "./pages/TestItemEge.jsx"; // Импортируем компонент для теста по ЕГЭ
import TestItemCl from "./pages/TestItemCl.jsx"; // Импортируем компонент для теста по классу
import TestQuest from "./pages/TestQuest.jsx"; // Импортируем компонент для отображения вопросов теста

if (!localStorage.getItem("count_tests")) { // Проверяем, есть ли в локальном хранилище информация о числе тестов
    localStorage.setItem("count_tests", 0); // Если нет, устанавливаем значение count_tests в 0
    localStorage.setItem("res_tests", 0); // Устанавливаем значение res_tests в 0
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes> # Используем Routes для определения маршрутов
                <Route path="/" element={<Main />} /> # Маршрут для главной страницы, отображаем Main компонент
                <Route path="faq" element={<Faq />} /> # Маршрут для страницы FAQ, отображаем Faq компонент
                <Route path="test" element={<TestPicker />} /> # Маршрут для страницы выбора теста, отображаем TestPicker компонент
                <Route path="pickitemoge" element={<TestItemOge />} /> # Маршрут для страницы выбора теста по ОГЭ, отображаем TestItemOge компонент
                <Route path="pickitemege" element={<TestItemEge />} /> # Маршрут для страницы выбора теста по ЕГЭ, отображаем TestItemEge компонент
                <Route path="mlad_klass" element={<TestItemCl />} /> # Маршрут для страницы выбора теста по классу, отображаем TestItemCl компонент
                <Route path="/oge/TestQuest/*" element={<TestQuest />} /> # Маршрут для страницы вопросов теста по ОГЭ, отображаем TestQuest компонент
                <Route path="/ege/TestQuest/*" element={<TestQuest />} /> # Маршрут для страницы вопросов теста по ЕГЭ, отображаем TestQuest компонент
                <Route path="/cl/TestQuest/*" element={<TestQuest />} /> # Маршрут для страницы вопросов теста по классу, отображаем TestQuest компонент
            </Routes>
        </BrowserRouter>
    );
}

export default App; // Экспортируем компонент App для использования в других частях приложения