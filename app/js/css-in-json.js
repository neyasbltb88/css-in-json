import Extend from './modules/extend';

// TODO: При генерации scoped стилей сделать определение нескольких селекторов,
// записанных через запятую, и вставлять перед каждый атрибут scoped

class CSSinJSON {
    constructor(options = {}) {
        this.elems_selector = []; // Селекторы элементов
        this.scoped_elems = []; // Сами элементы
        this.scoped = false; // Флаг изоляции стилей

        // this.elem_selector = options.elem; // Селектор элемента
        // this.elem = document.querySelector(options.elem); // Сам элемент
        // this.scoped = options.scoped; // Флаг изоляции стилей

        this.style_obj = options.style; // Объект стилей


        this.Extend = Extend; // Плагин объединения объектов

        this.scopedId = ''; // Здесь будет сгенерированный id для изоляции стилей
        this.style_string = ''; // Здесь будут сгенерированные стили в виде строки


        // Точка входа
        this.init(options.scopedElem);
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

    findScopedElems(selector) {
        if (typeof selector === 'object') {
            selector.forEach(element => {
                this.elems_selector.push(element);
                let elems_of_selector = document.querySelectorAll(element);
                elems_of_selector.forEach(elem => {
                    elem.dataset.scoped = this.scopedId;
                    this.scoped_elems.push(elem);
                })
            });
        } else if (typeof selector === 'string') {
            this.elems_selector.push(selector);
            this.scoped_elems = document.querySelectorAll(selector);
            this.scoped_elems.forEach(elem => {
                elem.dataset.scoped = this.scopedId;
            })
        }

        this.scoped = (this.scoped_elems.length > 0) ? true : false;
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

    // TODO: Улучшить поиск базового селектора
    // Метод для генерации селекторов с атрибутом scoped.
    // Разбирает несколько селекторов, указанных через запятую
    scopedSelectorGenerate(selector) {
        let regex = /(,\s*\n*\t*)/gm;
        let selector_arr = selector.split(regex).filter(selector => (selector.search(regex) === -1) ? true : false);
        let scoped_selector = `[data-scoped=${this.scopedId}]`;
        let new_selector = '';

        // Цикл по селекторам, указанным в стилях через запятую
        selector_arr.forEach(selector => {
            // Если надо генерировать изолированные стили
            if (this.scoped) {

                // Цикл по каждому базовому селектору
                this.elems_selector.forEach(scoped_elem => {
                    // Если селектор соответствует базовому селектору scoped
                    if (scoped_elem === selector) {
                        new_selector += `${selector}${scoped_selector},\n`;
                        // Если селектор НЕ соответствует базовому селектору scoped
                    } else {
                        new_selector += `${scoped_selector} ${selector},\n`;
                    }
                });

                // Если НЕ надо генерировать изолированные стили
            } else {
                new_selector += `${selector},\n`;
            }
        })

        return new_selector.slice(0, -2);
    }

    // Генерирует строковые стили для одного селектора
    objToStyle(selector, obj) {
        let scoped_selector = (this.scoped) ? `[data-scoped=${this.scopedId}]` : '';
        let style = '';
        for (let prop in obj) {
            style += `\n    ${this.camelToKebab(prop)}: ${obj[prop]};`
        }

        return `${this.scopedSelectorGenerate(selector)} {${style}\n}`;


    }

    // // Генерирует строковые стили для одного селектора
    // objToStyle2(selector, obj) {
    //     let scoped_selector = (this.scoped) ? `[data-scoped=${this.scopedId}]` : '';
    //     let style = '';
    //     for (let prop in obj) {
    //         style += `\n    ${this.camelToKebab(prop)}: ${obj[prop]};`
    //     }

    //     let base_elem = false;
    //     this.elems_selector.forEach(scoped_elem => {
    //         if (scoped_elem === selector) {
    //             base_elem = true;
    //         }
    //     });

    //     if (base_elem) {
    //         return `${selector}${scoped_selector} {${style}\n}`
    //     } else {
    //         return `${scoped_selector} ${selector} {${style}\n}`
    //     }


    // }

    // Генерирует полные стили по входящему объекту
    jsonToStyle(json) {
        let style = '';
        for (let selector in json) {
            style += this.objToStyle(selector, json[selector]) + '\n\n';
        }

        return style;
    }


    init(selector) {
        this.scopedId = this.scopedIdGenerate();

        console.log('selector: ', selector);

        this.findScopedElems(selector);


        // Сгенерировать строку стилей из полученного объекта
        this.style_string = this.jsonToStyle(this.style_obj);

        // Вставить сгенерированные стили на страницу
        this.styleInject(this.style_string, document.head, 'CSSinJSON_style', this.scopedId);
    }
}

window.CSSinJSON = CSSinJSON;