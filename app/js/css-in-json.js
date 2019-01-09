import Extend from './modules/extend';

// TODO: При генерации scoped стилей сделать определение нескольких селекторов,
// записанных через запятую, и вставлять перед каждый атрибут scoped

class CSSinJSON {
    constructor(options) {
        this.elem_selector = options.elem; // Селектор элемента
        this.elem = document.querySelector(options.elem); // Сам элемент
        this.style_obj = options.style; // Объект стилей
        this.scoped = options.scoped; // Флаг изоляции стилей

        this.Extend = Extend; // Плагин объединения объектов

        this.scopedId = ''; // Здесь будет сгенерированный id для изоляции стилей
        this.style_string = ''; // Здесь будут сгенерированные стили в виде строки


        // Точка входа
        this.init();
    }

    // Генератор рандомного числа
    rand(min, max) {
        let rand = Math.floor(min + Math.random() * (max + 1 - min));
        return rand;
    }

    // Конвертер camelCase в cebab-case
    camelToKebab(camel) {
        return camel.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    // Генератор id для изоляции в диапазоне символов a-z
    scopedIdGenerate() {
        let id = '';
        for (let i = 0; i < 10; i++) {
            id += String.fromCharCode(this.rand(97, 122));
        }

        return id;
    }

    // TODO: разобраться с этим методом
    // Метод расширения стилей, пока работает не правильно
    extend(obj1, obj2) {
        this.style_obj = this.Extend(obj1, obj2);
        this.style_string = this.jsonToStyle(this.style_obj, this.scopedId);
        this.updateStyleInject(this.style_string, this.scopedId);

        return this.style_string;
    }

    // Вставка новых стилей в готовый элемент style
    updateStyleInject(style_content, scoped) {
        let stl = document.querySelector(`#${scoped}`);
        stl.textContent = style_content;
    }

    // Создание нового элемента style и заполнение его атрибутами и стилями
    styleInject(style_content, elem, class_name, scoped) {
        let stl = document.createElement('style');
        stl.id = scoped;
        stl.className = class_name;
        stl.textContent = style_content;
        elem.appendChild(stl);
    }


    // Генерирует строковые стили для одного селектора
    objToStyle(selector, obj, scoped) {
        let scoped_selector = (scoped !== '') ? `[data-scoped=${scoped}]` : '';
        let style = '';
        for (let prop in obj) {
            style += `\n    ${this.camelToKebab(prop)}: ${obj[prop]};`
        }

        if (selector === this.elem_selector) {
            return `${selector}${scoped_selector} {${style}\n}`
        }

        return `${scoped_selector} ${selector} {${style}\n}`
    }

    // Генерирует полные стили по входящему объекту
    jsonToStyle(json, scoped = '') {
        let style = '';
        for (let selector in json) {
            style += this.objToStyle(selector, json[selector], scoped) + '\n\n';
        }

        return style;
    }


    init() {
        // Если нужно, сгенерировать id для изоляции стилей
        if (this.scoped) {
            this.scopedId = this.scopedIdGenerate();
            try {
                this.elem.dataset.scoped = this.scopedId;
            } catch (err) {
                console.error('CSSinJSON: Указанный базовый селектор не найден!\nБудет использован тег body');

                this.elem_selector = 'body';
                this.elem = document.querySelector(this.elem_selector);
                this.elem.dataset.scoped = this.scopedId;
            }
        }

        // Сгенерировать строку стилей из полученного объекта
        this.style_string = this.jsonToStyle(this.style_obj, this.scopedId);

        // Вставить сгенерированные стили на страницу
        this.styleInject(this.style_string, document.head, 'CSSinJSON_style', this.scopedId);
    }
}

window.CSSinJSON = CSSinJSON;