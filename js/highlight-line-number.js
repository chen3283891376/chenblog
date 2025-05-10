(function() {
    // From https://gitee.com/zhou-jian-guo/highlight_line_number
    // Readme: https://gitee.com/zhou-jian-guo/highlight_line_number/blob/master/README.md
    // (Chinese, you can translate it to English if you want)
    // Author: zhou-jian-guo
    // 进行了适配性的修改
    // License: GPL-3.0

    let TABLE_NAME = "hljs-ln",
        LINE_NAME = "hljs-ln-line",
        CODE_BLOCK_NAME = "hljs-ln-code",
        NUMBERS_BLOCK_NAME = "hljs-ln-numbers",
        NUMBER_LINE_NAME = "hljs-ln-n",
        DATA_ATTR_NAME = "data-line-number",
        BREAK_LINE_REGEXP = /\r\n|\r|\n/g;

    // 添加样式函数
    function addStyles() {
        let css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = format(
            ".{0}{border-collapse:collapse}" +
            ".{0} td{padding:0}" +
            ".{1}:before{content:attr({2})}",
            [TABLE_NAME, NUMBER_LINE_NAME, DATA_ATTR_NAME]
        );
        document.getElementsByTagName("head")[0].appendChild(css);
    }

    // 页面加载完成后初始化行号
    function initLineNumbersOnLoad(options) {
        if (
            document.readyState === "interactive" ||
            document.readyState === "complete"
        ) {
            documentReady(options);
        } else {
            window.addEventListener("DOMContentLoaded", function () {
                documentReady(options);
            });
        }
    }

    // 文档加载完成后的处理
    function documentReady(options) {
        try {
            let blocks = document.querySelectorAll("code.hljs,code.nohighlight");

            for (let i in blocks) {
                // eslint-disable-next-line no-prototype-builtins
                if (blocks.hasOwnProperty(i)) {
                    if (!isPluginDisabledForBlock(blocks[i])) {
                        lineNumbersBlock(blocks[i], options);
                    }
                }
            }
        } catch (e) {
            window.console.error("LineNumbers error: ", e);
        }
    }

    // 检查是否为该代码块禁用了插件
    function isPluginDisabledForBlock(element) {
        return element.classList.contains("nohljsln");
    }

    // 为单个代码块添加行号
    function lineNumbersBlock(element, options) {
        if (typeof element !== "object") return;
        element.innerHTML = lineNumbersInternal(element, options);
    }

    // 内部函数：处理代码并添加行号
    function lineNumbersInternal(element, options) {
        let internalOptions = mapOptions(element, options);

        duplicateMultilineNodes(element);

        return addLineNumbersBlockFor(element.innerHTML, internalOptions);
    }

    // 为HTML内容添加行号表格
    function addLineNumbersBlockFor(inputHtml, options) {
        let lines = getLines(inputHtml);

        // 如果最后一行只包含换行符，则移除它
        if (lines[lines.length - 1].trim() === "") {
            lines.pop();
        }

        if (lines.length > 1 || options.singleLine) {
            let html = "";

            for (let i = 0, l = lines.length; i < l; i++) {
                html += format(
                    "<tr>" +
                    '<td class="{0} {1}" {3}="{5}">' +
                    '<div class="{2}" {3}="{5}"></div>' +
                    "</td>" +
                    '<td class="{0} {4}" {3}="{5}">' +
                    "{6}" +
                    "</td>" +
                    "</tr>",
                    [
                        LINE_NAME,
                        NUMBERS_BLOCK_NAME,
                        NUMBER_LINE_NAME,
                        DATA_ATTR_NAME,
                        CODE_BLOCK_NAME,
                        i + options.startFrom,
                        lines[i].length > 0 ? lines[i] : " ",
                    ]
                );
            }

            return format('<table class="{0}">{1}</table>', [TABLE_NAME, html]);
        }

        return inputHtml;
    }

    /**
     * @param {HTMLElement} element Code block.
     * @param {Object} options External API options.
     * @returns {Object} Internal API options.
     */
    function mapOptions(element, options) {
        options = options || {};
        return {
            singleLine: getSingleLineOption(options),
            startFrom: getStartFromOption(element, options),
        };
    }

    // 获取单行选项
    function getSingleLineOption(options) {
        let defaultValue = false;
        if (options.singleLine) {
            return options.singleLine;
        }
        return defaultValue;
    }

    // 获取起始行号选项
    function getStartFromOption(element, options) {
        let defaultValue = 1;
        let startFrom = defaultValue;

        if (isFinite(options.startFrom)) {
            startFrom = options.startFrom;
        }

        // 可以被覆盖，因为局部选项优先级更高
        let value = getAttribute(element, "data-ln-start-from");
        if (value !== null) {
            startFrom = toNumber(value, defaultValue);
        }

        return startFrom;
    }

    /**
     * 递归方法，修复highlight.js中多行元素的实现
     * 对子节点进行深度遍历
     * @param {HTMLElement} element
     */
    function duplicateMultilineNodes(element) {
        let nodes = element.childNodes;
        for (let node in nodes) {
            // eslint-disable-next-line no-prototype-builtins
            if (nodes.hasOwnProperty(node)) {
                let child = nodes[node];
                if (getLinesCount(child.textContent) > 0) {
                    if (child.childNodes.length > 0) {
                        duplicateMultilineNodes(child);
                    } else {
                        duplicateMultilineNode(child.parentNode);
                    }
                }
            }
        }
    }

    /**
     * 修复highlight.js中多行元素的实现
     * @param {HTMLElement} element
     */
    function duplicateMultilineNode(element) {
        let className = element.className;

        if (!/hljs-/.test(className)) return;

        let lines = getLines(element.innerHTML);

        for (var i = 0, result = ""; i < lines.length; i++) {
            let lineText = lines[i].length > 0 ? lines[i] : " ";
            result += format('<span class="{0}">{1}</span>\n', [
                className,
                lineText,
            ]);
        }

        element.innerHTML = result.trim();
    }

    // 获取文本行数组
    function getLines(text) {
        if (text.length === 0) return [];
        return text.split(BREAK_LINE_REGEXP);
    }

    // 获取文本行数
    function getLinesCount(text) {
        return (text.trim().match(BREAK_LINE_REGEXP) || []).length;
    }

    /**
     * 字符串格式化函数
     * {@link https://wcoder.github.io/notes/string-format-for-string-formating-in-javascript}
     * @param {string} format
     * @param {array} args
     */
    function format(format, args) {
        return format.replace(/\{(\d+)\}/g, function (m, n) {
            return args[n] !== undefined ? args[n] : m;
        });
    }

    /**
     * 获取元素属性值
     * @param {HTMLElement} element Code block.
     * @param {String} attrName Attribute name.
     * @returns {String} Attribute value or empty.
     */
    function getAttribute(element, attrName) {
        return element.hasAttribute(attrName)
            ? element.getAttribute(attrName)
            : null;
    }

    /**
     * 将字符串转换为数字
     * @param {String} str Source string.
     * @param {Number} fallback Fallback value.
     * @returns Parsed number or fallback value.
     */
    function toNumber(str, fallback) {
        if (!str) return fallback;
        let number = Number(str);
        return isFinite(number) ? number : fallback;
    }

    // 添加样式
    addStyles();

    // 初始化行号
    initLineNumbersOnLoad();

    // 对外暴露API
    window.LineNumbers = {
        lineNumbersBlock: lineNumbersBlock,
        initLineNumbersOnLoad: initLineNumbersOnLoad
    };
})();