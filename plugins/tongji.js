/**
 * @file
 */
module.exports = function (context, options) {
  return {
    name: "docusaurus-plugin-tongji",
    injectHtmlTags({ content }) {
      return {
        preBodyTags: [{
            tagName: 'script',
            innerHTML: `
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?64a3c7fa9e8533c72827dc22e0d273ab";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
              `
        }]
      };
    },
  };
};
