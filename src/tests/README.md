# Thumbly Plugin Tests

Этот каталог содержит функциональные тесты для плагина Thumbly для Figma.

## Структура тестов

### `setup.ts`
- Утилиты для создания тестовых данных
- Хелперы для мокирования объектов
- Общие функции для тестирования

### `functional.test.ts`
- **Основные функциональные тесты**
- Тестирование создания миниатюр
- Валидация конфигурации
- Проверка обработки данных
- Тестирование edge cases

### `plugin.test.ts`
- Интеграционные тесты основной функциональности
- Тестирование интерфейсов и типов данных
- Валидация входных данных
- Проверка конфигурации

### `validation.test.ts`
- Тесты валидации данных миниатюр
- Проверка обязательных полей
- Тестирование граничных случаев
- Проверка типов данных

### `config.test.ts`
- Тесты конфигурации плагина
- Проверка цветовых схем
- Валидация размеров и отступов
- Тестирование типографики

## Запуск тестов

```bash
# Запуск всех тестов
npm test

# Запуск в режиме наблюдения
npm run test:watch

# Запуск с отчетом о покрытии
npm run test:coverage
```

## Покрытие тестами

Функциональные тесты покрывают следующие сценарии:

### 🎯 Основные сценарии использования
- **Создание миниатюр** - светлая и темная темы
- **Пользовательские изображения** - загрузка и обработка
- **Валидация данных** - проверка всех обязательных полей
- **Обработка сообщений** - create-thumbnail и cancel

### ⚙️ Конфигурация и настройки
- **Размеры кадров** - правильные пропорции 16:9
- **Типографика** - размеры шрифтов и интервалы
- **Цветовые схемы** - контрастность и валидность
- **Цепочки шрифтов** - fallback стратегии

### 🧮 Вычисления и макет
- **Позиционирование** - центрирование в viewport
- **Отступы и паддинги** - расчет content area
- **Контрастность цветов** - accessibility проверки

### 🔍 Edge Cases
- **Длинные тексты** - обработка больших строк
- **Специальные символы** - quotes, эмодзи, HTML tags
- **Различные типы эмодзи** - compound, variations
- **Пустые данные** - null значения

## Тестовые данные

Используйте утилиты из `setup.ts` для создания тестовых данных:

```typescript
import { createMockThumbnailData, createMockRGB, createMockFontStyle } from './setup';

// Базовые данные миниатюры
const testData = createMockThumbnailData({
  title: 'Test Title',
  theme: 'dark'
});

// RGB цвета
const color = createMockRGB({ r: 0.5, g: 0.2, b: 0.8 });

// Стили шрифтов
const font = createMockFontStyle({ family: 'Roboto', style: 'Bold' });
```

## Результаты тестов

Все тесты сосредоточены на **функциональности** плагина, а не на производительности. Это позволяет:

- ✅ Проверить корректность основных сценариев использования
- ✅ Убедиться в правильности валидации данных
- ✅ Протестировать обработку ошибок и edge cases
- ✅ Валидировать конфигурацию и настройки
- ✅ Проверить accessibility (контрастность цветов) 