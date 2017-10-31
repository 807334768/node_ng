

import $ from "jquery";

import b from 'bootstrap/dist/css/bootstrap.min.css';
import bj from 'bootstrap/dist/js/bootstrap.min.js';

import btc from '../css/framework/bootstrap-datetimepicker.css';
import bvc from '../css/framework/bootstrapValidator.min.css';

import timepickerJs from './framework/bootstrap-datetimepicker.js';
import timepickerJsCN from './framework/bootstrap-detatimepicker.zh-CN.js';

import bvj from './framework/bootstrapValidator.min.js'

import style from '../css/style.css';

import hCss from '../css/framework/highcharts.css';
import angularJs from './framework/angular.min.js';

import highcharts from './framework/highcharts.js';
import hNg from './framework/highcharts-ng.js';
import pagination from './framework/angular.pagination.js';
import uiRouter from './framework/angular-ui-router.js';


import appRouter from './config/router';
import appRuning from './config/run';

/*import formValidator from './config/formValidator';*/
import home from './controller/home';
import search from './controller/search';
import table from './controller/table';
import register from './controller/register';
import chart from './controller/chart';
import info from './controller/info';

var app = angular.module("app", [uiRouter,'highcharts-ng','pagination',])
    .config(appRouter)
    .run(appRuning)
    .controller('searchCtrl', search)
    .controller('tableCtrl', table)
    .controller('registerCtrl', register)
    .controller('chartCtrl', chart)
    .controller('infoCtrl', info)



