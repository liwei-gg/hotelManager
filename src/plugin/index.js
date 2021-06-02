import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
import myPlugin from "./myPlugin";
Vue.use(myPlugin);
import VueQuillEditor from "vue-quill-editor";

import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme

Vue.use(VueQuillEditor);
