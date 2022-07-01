
const {LZString} = require('./lzstring');

function parseData(text, url) {
    let doc = HTMLParser.parse(text);

    let summary = doc.querySelector('#intro-all').text.trim();
    let subtitle = doc.querySelector('.book-title h2').text.trim();

    let lists = doc.querySelectorAll('.chapter-list'), results = [];
    if (lists.length === 0) {
        let stateNode = doc.querySelector('#__VIEWSTATE');
        if (stateNode) {
            let ctx = new ScriptContext();
            ctx.eval(LZString);
            let html = ctx.eval('LZString.decompressFromBase64("' + stateNode.getAttribute('value') + '")');
            doc = HTMLParser.parse(html);
            lists = doc.querySelectorAll('.chapter-list');
        }
    }
    for (let list of lists) {
        let ul_arr = list.querySelectorAll('ul').reverse();
        for (let ul of ul_arr) {
            let li_arr = ul.querySelectorAll('li > a');
            for (let li of li_arr) {
                let item = {};
                item.title = li.getAttribute('title');
                console.log(`title ${item.title}`);
                item.link = new URL(li.getAttribute('href'), url).toString();
                item.subtitle = li.querySelector('i').text;
                results.push(item);
            }
        }
    }
    return {
        subtitle: subtitle,
        summary: summary,
        list: results.reverse(),
    };

    // let summary = doc.querySelector('.detail-desc').text;
    // let authors = doc.querySelectorAll('.detail-main-info-author a');
    // let alist = [];
    // for (let a of authors) {
    //     alist.push(a.text);
    // }
    // let subtitle = alist.join(',');

    // let links = doc.querySelectorAll('#tempc > ul > li > a');
    // let list = [];
    // for (let link of links) {
    //     let item = {
    //         link: new URL(link.getAttribute('href'), url).toString(),
    //     };
    //     let title = link.querySelector('.detail-list-2-info-title');
    //     if (title) {
    //         item.title = title.text.replace(/ +/, ' ') 
    //     } else {
    //         item.title = link.text.replace(/ +/, ' ');
    //     }
    //     if (link.querySelector('.detail-list-2-info-right')) 
    //         item.subtitle = 'VIP';
    //     list.push(item);
    // }

    // return {
    //     subtitle: subtitle,
    //     summary: summary,
    //     list: list.reverse(),
    // };
}

module.exports = async function(url) {
    console.log(`Fetch ${url}`);
    let res = await fetch(url, {
    });
    let text = await res.text();

    return parseData(text, url);
}