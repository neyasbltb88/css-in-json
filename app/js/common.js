window.style = {
    'body': {
        'margin': '30px 0',
        'background-color': '#555',
    },

    '.container': {
        margin: '0 auto',
        backgroundColor: '#dedede',
        boxShadow: '0 0 20px 0px rgba(0, 0, 0, 0.5)',
        maxWidth: '800px',
        padding: '15px',
        borderRadius: '3px',
    },

    '.inline': {
        display: 'inline-block',
        margin: 0,
        padding: 0,
    },

    'h2, h3': {
        textAlign: 'center'
    },

    '.rich_h3': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    '.section': {
        marginBottom: '15px',
        padding: '15px',
    },

    '.section:last-child': {
        marginBottom: 0,
    },

    '.pre_block': {
        border: '1px solid #bbb',
        borderRadius: '3px',
        padding: '1em',
        margin: '.5em 0',
        overflow: 'auto',
        boxShadow: '0 0 8px 0px rgba(0, 0, 0, 0.1)',
        maxHeight: '100vh',
        overflowY: 'auto',
    },

    'pre.inline': {
        display: 'inline-block',
        padding: '0 5px',
    },

    '.language-json .token.operator, .language-javascript .token.operator': {
        background: 'transparent',
    },
}

window.style2 = {
    'ul': {
        'list-style-type': 'none'
    },
    '.section': {
        'border-radius': '15px',
    },
}

//////////////////////////////////////

const CssInJson = new CSSinJSON({
    style: style,
    // scopedElem: 'body',
    // scopedElem: '.container',
    scopedElem: ['.container', 'body'],
    // scopedElem: '.section_1',
});




const CssInJson2 = new CSSinJSON({
    style: {
        '.test': {
            color: '#f00'
        }
    },
    scopedElem: ['.scoped_class', '.scoped_class2']
});















//////////////////////////////////////
let style_info = document.querySelector('.style_info');
let CSSinJSON_style = document.querySelector('.CSSinJSON_style');
let style_show = document.querySelector('.style_show');
let json_show = document.querySelector('.json_show');
let base_selector = document.querySelector('.base_selector')

style_info.textContent = `<style id="${CSSinJSON_style.id}" class="${CSSinJSON_style.className}"></style>`;
style_show.textContent = CSSinJSON_style.textContent;

json_show.textContent = JSON.stringify(window.style, ' ', 4);

let selectors = '';
CssInJson.elems_selector.forEach(sel => {
    selectors = (sel !== '') ? selectors += sel + ', ' : selectors;
});

selectors = selectors.slice(0, -2);

base_selector.textContent = selectors || 'Не указан';