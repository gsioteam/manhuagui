class IndexController extends Controller {
    load() {
        this.data = {
            tabs: [
                {
                    "title": "最新发布",
                    "id": "last",
                    "url": "https://www.manhuagui.com/list/index_p{0}.html"
                },
                {
                    "title": "最新更新",
                    "id": "update",
                    "url": "https://www.manhuagui.com/list/update_p{0}.html"
                },
                {
                    "title": "人气最旺",
                    "id": "hot",
                    "url": "https://www.manhuagui.com/list/view_p{0}.html"
                },
                {
                    "title": "评分最高",
                    "id": "rate",
                    "url": "https://www.manhuagui.com/list/rate_p{0}.html"
                }
            ]
        };
    }
}

module.exports = IndexController;