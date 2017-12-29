/**
 * @overview 工具库
 *
 * =============================================================================
 *  百度统计
 * =============================================================================
 *
 * PV跟踪：
 * _hmt.push(['_trackPageview', pageURL]);
 *   {String} pageURL    指定要统计PV的页面URL，必须是以"/"（斜杠）开头的相对路径
 *
 * 事件跟踪：
 * _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
 *   {String} category   要监控的目标的类型名称。如"视频"、"音乐"、"软件"、"游戏"
 *   {String} action     用户跟目标交互的行为名称。如"播放"、"暂停"、"下载"
 *   {String} *opt_label 事件的一些额外信息。如歌曲、软件、链接的名称
 *   {Number} *opt_value 跟事件相关的数值。如权重、时长、价格
 *
 * 自定义变量：
 * _hmt.push(['_setCustomVar', index, name, value, opt_scope]);
 *   {Int}    index      自定义变量所占用的位置。取值范围为从1到5
 *   {String} name       自定义变量的名字
 *   {String} value      自定义变量的值
 *   {Int}    *opt_scope 自定义变量的作用范围。默认为3
 *     1为访客级别（对该访客始终有效）
 *     2为访次级别（在当前访次内生效）
 *     3为页面级别（仅在当前页面生效）
 *
 * 指定帐号：
 * _hmt.push(['_setAccount', siteId);
 *
 * 取消自动PV：
 * _hmt.push(['_setAutoPageview', false]);
 *
 *
 * -----------------------------------------------------------------------------
 *
 * @deprecated
 *
 * @author dondevi
 * @create 2015-03-05
 *
 * @update 2015-03-05
 */

/**
 * [description]
 * @param  {[type]} _hmt [description]
 * @return {[type]}      [description]
 */

