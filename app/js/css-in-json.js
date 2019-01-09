import Extend from './modules/extend';

class CSSinJSON {
    constructor(options) {
        this.elem_selector = options.elem;
        this.elem = document.querySelector(options.elem);
        this.style_obj = options.style;
        this.scoped = options.scoped;

        this.Extend = Extend;

        this.scopedId = '';
        this.style_string = '';


        this.init();
    }

    rand(min, max) {
        let rand = Math.floor(min + Math.random() * (max + 1 - min));
        return rand;
    }

    scopedIdGenerate() {
        let id = '';
        for (let i = 0; i < 10; i++) {
            id += String.fromCharCode(this.rand(97, 122));
        }

        return id;
    }

    extend(obj1, obj2) {
        this.style_obj = this.Extend(obj1, obj2);
        this.style_string = this.jsonToStyle(this.style_obj, this.scopedId);
        this.updateStyleInject(this.style_string, this.scopedId);

        return this.style_string;
    }

    updateStyleInject(style_content, scoped) {
        let stl = document.querySelector(`#${scoped}`);
        stl.textContent = style_content;
    }

    styleInject(style_content, elem, class_name, scoped) {
        let stl = document.createElement('style');
        stl.id = scoped;
        stl.className = class_name;
        stl.textContent = style_content;
        elem.appendChild(stl);
    }

    objToStyle(selector, obj, scoped) {
        let root_detect = (selector === this.elem_selector) ? '' : ' ';
        let scoped_selector = (scoped !== '') ? `[data-scoped=${scoped}]` : '';
        let style = '';
        for (let prop in obj) {
            style += `\n    ${prop}: ${obj[prop]};`
        }

        if (root_detect == '') {
            return `${selector}${scoped_selector} {${style}\n}`
        }

        return `${scoped_selector}${root_detect}${selector} {${style}\n}`
    }

    jsonToStyle(json, scoped = '') {
        let style = '';
        for (let selector in json) {
            style += this.objToStyle(selector, json[selector], scoped) + '\n\n';
        }

        return style;
    }


    init() {
        if (this.scoped) {
            this.scopedId = this.scopedIdGenerate();
            this.elem.dataset.scoped = this.scopedId;
        }

        this.style_string = this.jsonToStyle(this.style_obj, this.scopedId);

        this.styleInject(this.style_string, document.body, 'CSSinJSON_style', this.scopedId);
    }
}

// TODO: При генерации scoped стилей сделать определение нескольких селекторов,
// записанных через запятую, и вставлять перед каждый атрибут scoped

//////////////////////////////////////////////

window.style = {
    'body': {
        'margin': 0,
        'background-color': '#333',
    },

    '.container': {
        'margin': '0 auto',
        'background-color': '#dedede',
        'max-width': '800px',
        'padding': '15px',
    },

    'h2, h3': {
        'text-align': 'center'
    },

    '.section': {
        'border': '1px solid #000',
        'margin-bottom': '15px',
        'padding': '15px',
        'border-radius': '5px',
    },

    '.section:last-child': {
        'margin-bottom': '0',
    }
}

window.style2 = {
    'ul': {
        'list-style-type': 'none'
    },
    '.section': {
        'border-radius': '15px',
    },
}

window.CssInJson = new CSSinJSON({
    elem: 'body',
    // elem: '.container',
    style: style,
    scoped: true
});



//////////////////////////////////////
let style_info = document.querySelector('.style_info');
let CSSinJSON_style = document.querySelector('.CSSinJSON_style');
let style_show = document.querySelector('.style_show');
let json_show = document.querySelector('.json_show');

style_info.textContent = `В body вставлен тег <style id="${CSSinJSON_style.id} class="${CSSinJSON_style.className}"></style>`;
style_show.textContent = CSSinJSON_style.textContent;

json_show.textContent = JSON.stringify(window.style, ' ', 4);