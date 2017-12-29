/**
 * =============================================================================
 *  XFH5
 * =============================================================================
 *
 * @author dondevi
 * @create 2016-10-28
 *
 * @update 2017-05-23 dondevi
 *   1.Refactor
 */

"use strict";


/**
 * -----------------------------------------------------------------------------
 *  Vendors
 * -----------------------------------------------------------------------------
 * @see https://github.com/necolas/normalize.css/
 * @see https://github.com/ftlabs/fastclick/
 * @see https://github.com/jaridmargolin/bouncefix.js/
 */

import "vendors/normalize.css";
import FastClick from "vendors/fastclick.js";
import Bouncefix from "vendors/bouncefix.js";

// Init
document.addEventListener("DOMContentLoaded", () => {
  FastClick(document.body);
  Bouncefix.add("scrollable");
});


/**
 * -----------------------------------------------------------------------------
 *  Themes
 * -----------------------------------------------------------------------------
 */

// Core
import "themes/default/styles/default.css";
// Font
import "themes/default/fonts/index.css";
// UI
import "themes/default/styles/button.css";
import "themes/default/styles/media.css";
import "themes/default/styles/toast.css";
import "themes/default/styles/panel.css";
import "themes/default/styles/progress.css";
import "themes/default/styles/switch.css";
import "themes/default/styles/table.css";
import "themes/default/styles/badge.css";
// Util
import "themes/default/styles/util.css";
import "themes/default/styles/loading.css";
import "themes/default/styles/stage.css";
import "themes/default/styles/stagebar.css";
import "themes/default/styles/list.css";


/**
 * -----------------------------------------------------------------------------
 *  Modules
 * -----------------------------------------------------------------------------
 */

// Moniter
import "modules/Moniter/log.js";
// Core
import "modules/Core/core.js";
import "modules/Core/ajax.js";
import "modules/Core/fn.js";
import "modules/Core/event.js";
// Compat
import "modules/Compat/detect.js";
import "modules/Compat/polyfill.js";
import "modules/Compat/fixed.js";
// Util
import "modules/Util/index.js";
import "modules/Date/date.js";
import "modules/Date/time.js";
import "modules/Defer/index.js";
import "modules/Form/index.js";
import "modules/Form/validate.js";
import "modules/Image/index.js";
import "modules/Storage/index.js";


/**
 * -----------------------------------------------------------------------------
 *  Components
 * -----------------------------------------------------------------------------
 */

// Alert
import "components/Alert/index.css";
import "components/Alert/index.js";
// Carousel
import "components/Carousel/index.css";
import "components/Carousel/index.js";
// Collapse
import "components/Collapse/index.css";
import "components/Collapse/index.js";
// Modal
import "components/Modal/index.css";
import "components/Modal/actionsheet.css";
import "components/Modal/index.js";
// Number
import "components/Number/index.css";
import "components/Number/index.js";
// Offcanvas
import "components/Offcanvas/index.css";
import "components/Offcanvas/index.js";
// Sticky
import "components/Sticky/index.js";
// Tabs
import "components/Tabs/index.css";
import "components/Tabs/index.js";
// Zoom
import "components/Zoom/index.js";

// Page
import "components/Page/index.css";
import "components/Page/navbar.css";
import "components/Page/index.js";
import "components/Page/history.js";

// Form
import "components/Form/form.css";
import "components/Form/util.js";
import "components/Form/list.css";
import "components/Form/list.js";
import "components/Form/linkage.js";

// Map
import "components/Map/geolocation.js";
