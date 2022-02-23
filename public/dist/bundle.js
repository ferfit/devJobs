/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/***/ (() => {

eval("function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  //capturamos las skills\n  var skills = document.querySelector('.lista-conocimientos'); //si existen\n\n  if (skills) {\n    skills.addEventListener('click', agregarSkills); //una vez que estamos en editar\n\n    skillsSeleccionados();\n  } //limpiar alertas\n\n\n  var alertas = document.querySelector('.alertas');\n\n  if (alertas) {\n    limpiarAlertas();\n  }\n});\nvar skills = new Set(); // El objeto Set permite almacenar valores únicos de cualquier tipo, incluso valores primitivos u referencias a objetos.\n\nvar agregarSkills = function agregarSkills(e) {\n  if (e.target.tagName === 'LI') {\n    if (e.target.classList.contains('activo')) {\n      //quitar del set y quitar la clase\n      //console.log(e.target.textContent)\n      skills[\"delete\"](e.target.textContent); //este add es un metodo de la clase new Set\n\n      e.target.classList.remove('activo');\n    } else {\n      //agregar al set y agregar la clase\n      //console.log(e.target.textContent)\n      skills.add(e.target.textContent); //este add es un metodo de la clase new Set\n\n      e.target.classList.add('activo');\n    }\n  } //converimos el objet set en un arreglo, los 3 puntos es para hacer una copia de esa variable\n\n\n  var skillsArray = _toConsumableArray(skills); //Le asignamos el valor al input hidden del formulario crear publicacion\n\n\n  document.querySelector('#skills').value = skillsArray;\n};\n\nvar skillsSeleccionados = function skillsSeleccionados() {\n  var seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo')); //Agregamos nuevas skills, recordar que este metodo add, si ya existe no lo agrega\n\n  seleccionadas.forEach(function (seleccionada) {\n    skills.add(seleccionada.textContent);\n  }); //inyectamos en el input hidden\n\n  var skillsArray = _toConsumableArray(skills);\n\n  document.querySelector('#skills').value = skillsArray;\n};\n\nvar limpiarAlertas = function limpiarAlertas() {\n  var alertas = document.querySelector('.alertas');\n  var interval = setInterval(function () {\n    if (alertas.children.length > 0) {\n      alertas.removeChild(alertas.children[0]);\n    } else if (alertas.children.length === 0) {\n      alertas.parentElement.removeChild(alertas); //remueve el padre\n\n      clearInterval(interval);\n    }\n  }, 1500);\n};\n\n//# sourceURL=webpack://devjobs/./public/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/js/app.js"]();
/******/ 	
/******/ })()
;