
const baseURL = 'https://www.manhuagui.com/s/{0}_p{1}.html';

class SearchController extends Controller {

    load() {
        let str = localStorage['hints'];
        let hints = [];
        if (str) {
            let json = JSON.parse(str);
            if (json.push) {
                hints = json;
            }
        }
        this.data = {
            list: [],
            focus: false,
            hints: hints,
            text: '',
            loading: false,
            hasMore: false,
        };
    }

    makeURL(word, page) {
        return baseURL.replace('{0}', encodeURIComponent(word)).replace('{1}', page + 1);
    }

    onSearchClicked() {
        this.findElement('input').submit();
    } 

    onTextChange(text) {
        this.data.text = text;
    }

    async onTextSubmit(text) {
        let hints = this.data.hints;
        if (text.length > 0) {
            if (hints.indexOf(text) < 0) {
                this.setState(()=>{
                    hints.unshift(text);
                    while (hints.length > 30) {
                        hints.pop();
                    }
    
                    localStorage['hints'] = JSON.stringify(hints);
                });
            }
            
            this.setState(()=>{
                this.data.loading = true;
            });
            try {
                let list = await this.request(this.makeURL(text, 0));
                this.key = text;
                this.page = 0;
                this.setState(()=>{
                    this.data.list = list;
                    this.data.loading = false;
                });
            } catch(e) {
                showToast(`${e}\n${e.stack}`);
                this.setState(()=>{
                    this.data.loading = false;
                });
            }
        }
    }

    onTextFocus() {
        this.setState(()=>{
            this.data.focus = true;
        });
    }

    onTextBlur() {
        this.setState(()=>{
            this.data.focus = false;
        });
    }

    async onPressed(index) {
        await this.navigateTo('book', {
            data: this.data.list[index]
        });
    }

    onHintPressed(index) {
        let hint = this.data.hints[index];
        if (hint) {
            this.setState(()=>{
                this.data.text = hint;
                this.findElement('input').blur();
                this.onTextSubmit(hint);
            });
        }
    }

    async onRefresh() {
        let text = this.key;
        if (!text) return;
        try {
            let list = await this.request(this.makeURL(text, 0));
            this.page = 0;
            this.setState(()=>{
                this.data.list = list;
                this.data.loading = false;
            });
        } catch(e) {
            showToast(`${e}\n${e.stack}`);
            this.setState(()=>{
                this.data.loading = false;
            });
        }
    }

    async onLoadMore() {
        let page = this.page + 1;
        try {
            let list = await this.request(this.makeURL(this.key, page));
            this.page = page;
            this.setState(()=>{
                for (let item of list) {
                    this.data.list.push(item);
                }
                this.data.loading = false;
            });
        } catch(e) {
            showToast(`${e}\n${e.stack}`);
            this.setState(()=>{
                this.data.loading = false;
            });
        }
    }

    async request(url) {
        let res = await fetch(url);
        let text = await res.text();
        
        let doc = HTMLParser.parse(text);
        
        let items = [];

        let nodes = doc.querySelectorAll('.book-result .cf .book-cover .bcover');

        for (let node of nodes) {
            let item = {};
            item.link = new URL(node.getAttribute('href'), url).toString();
            item.title = node.getAttribute('title');
            item.picture = new URL(node.querySelector('img').getAttribute('src'), url).toString();
            item.subtitle = node.querySelector('.tt').text.trim(),
            items.push(item);
        }
        return items;
    }
}

module.exports = SearchController;