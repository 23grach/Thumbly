# Thumbly 🚀

**Красивые thumbnail-фреймы для вашего контента в Figma**

Thumbly — это плагин для Figma, который позволяет быстро создавать стильные обложки (thumbnail) для презентаций, проектов и любого другого контента. Создавайте профессиональные макеты с эмодзи, заголовками и описаниями всего в несколько кликов.

## ✨ Возможности

- 📝 **Заголовок** — обязательное поле для названия вашего контента
- 💭 **Описание** — необязательное поле для дополнительной информации  
- 😀 **Эмодзи** — выбор из 36 популярных эмодзи для визуального акцента
- 🌓 **Темы** — светлая и тёмная темы оформления
- 🎨 **Автоматическая верстка** — использует Auto Layout для идеального позиционирования
- 📐 **Стандартный размер** — 1920×960px, идеально для обложек

## 🎯 Как использовать

1. **Откройте плагин** в Figma через меню Plugins
2. **Введите заголовок** — это обязательное поле
3. **Добавьте описание** (по желанию) — дополнительная информация
4. **Выберите эмодзи** — кликните на любой из предложенных вариантов
5. **Выберите тему** — светлая 🌞 или тёмная 🌚
6. **Нажмите "Создать"** — фрейм появится в центре страницы

## 🎨 Технические детали

### Размеры и отступы
- **Размер фрейма:** 1920×960 px
- **Отступы:** 240px слева, 100px сверху
- **Расстояние между заголовком и описанием:** 24px

### Типографика
- **Эмодзи:** Rubik Bold, 224px
- **Заголовок:** Archivo Bold, 145px, межбуквенный интервал -5%
- **Описание:** Rubik Regular, 72px, прозрачность 80%, межбуквенный интервал -2%

### Цветовые схемы
**Светлая тема 🌞**
- Фон: #FFFFFF
- Текст: #000000

**Тёмная тема 🌚**
- Фон: #1E1E1E  
- Текст: #FFFFFF

## 🛠 Разработка

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Отслеживание изменений
npm run watch

# Проверка кода
npm run lint
```

## 📋 Требования

- Figma (десктопная версия или браузерная)
- Доступ к установке плагинов

## 🎪 Особенности

- **Офлайн работа** — не требует интернет-соединения  
- **Быстрое создание** — фрейм создается мгновенно
- **Адаптивность** — автоматически подстраивается под контент
- **Профессиональный дизайн** — готов к использованию без доработок

---

*Создано для дизайнеров, которые ценят время и качество* ⭐

Below are the steps to get your plugin running. You can also find instructions at:

  https://www.figma.com/plugin-docs/plugin-quickstart-guide/

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

  https://nodejs.org/en/download/

Next, install TypeScript using the command:

  npm install -g typescript

Finally, in the directory of your plugin, get the latest type definitions for the plugin API by running:

  npm install --save-dev @figma/plugin-typings

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
