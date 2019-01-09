window.style = {
    'body': {
        'margin': 0,
        'background-color': '#333',
    },

    '.container': {
        margin: '0 auto',
        backgroundColor: '#dedede',
        maxWidth: '800px',
        padding: '15px',
    },

    'h2, h3': {
        textAlign: 'center'
    },

    '.section': {
        border: '1px solid #000',
        marginBottom: '15px',
        padding: '15px',
        borderRadius: '5px',
    },

    '.section:last-child': {
        marginBottom: 0,
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

//////////////////////////////////////

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
let base_selector = document.querySelector('.base_selector')

style_info.textContent = `В head вставлен тег <style id="${CSSinJSON_style.id}" class="${CSSinJSON_style.className}"></style>`;
style_show.textContent = CSSinJSON_style.textContent;

json_show.textContent = JSON.stringify(window.style, ' ', 4);

base_selector.textContent = CssInJson.elem_selector;