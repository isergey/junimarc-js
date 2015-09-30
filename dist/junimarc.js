!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.Junimarc=r():t.Junimarc=r()}(this,function(){return function(t){function r(i){if(e[i])return e[i].exports;var o=e[i]={exports:{},id:i,loaded:!1};return t[i].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var e={};return r.m=t,r.c=e,r.p="",r(0)}([function(t,r){"use strict";function e(t){this._data=t||""}function i(t){if(this.constructor===i)throw new Error("Can't instantiate abstract class");this._id=t||"",l(this._id)}function o(t,r){i.call(this,t),this._data=r||""}function n(t,r){i.call(this,t),this._fields=r||[],c(this._fields)}function s(t){if(this.constructor===s)throw new Error("Can't instantiate abstract class");this._tag=t||"",d(this._tag)}function f(t,r){s.call(this,t),this._data=r||""}function a(t,r,e,i){s.call(this,t),this._i1=r||" ",this._i2=e||" ",this._subfields=i||[],p(this._i1),p(this._i2),h(this._subfields)}function u(t,r){this._leader=t||new e,this._fields=r||[],c(this._fields)}function d(t){if("string"!=typeof t||!t)throw new Error("Field must have String tag")}function p(t){if("string"!=typeof t||1!==t.length)throw new Error("DataField indicator must be String from one symbol")}function h(t){if(!Array.isArray(t))throw new Error("DataField subfields must be Array instance");var r=0;for(r=0;r<t.length;r++){var e=t[r];if(!(e instanceof i))throw new Error("Subfield at index "+r+" must be DataSubfield or ExtendedSubfield instance")}}function l(t){if("string"!=typeof t||!t)throw new Error("DataSubfield must have id")}function c(t){if(!Array.isArray(t))throw new Error("Fields of extended subfield must be Array instance");var r=0;for(r=0;r<t.length;r++){var e=t[r];if(!(e instanceof s))throw new Error("Field at index "+r+" must be ControlField or DataField instance")}}function y(t,r){if(r){for(var e=[],i=0;i<t.length;i++){var o=t[i];o.getTag()===r&&e.push(o)}return e}return t}function g(t,r){var e=r;e instanceof RegExp||(e=new RegExp(e));for(var i=[],o=0;o<t.length;o++){var n=t[o];Array.isArray(n.getTag().match(e))&&i.push(n)}return i}function _(t){var r={},e=0;for(e=0;e<t.length;e++){var i=t[e],o=i.getTag(),n=r[o];n||(n=[],r[o]=n),n.push(i)}return r}function b(t){var r={},e=0;for(e=0;e<t.length;e++){var i=t[e],o=i.getId(),n=r[o];n||(n=[],r[o]=n),n.push(i)}return r}Object.defineProperty(r,"__esModule",{value:!0}),e.prototype.getData=function(){return this._data},e.prototype.setData=function(t){return this._data=t||"",this},i.prototype.getId=function(){return this._id},o.prototype=Object.create(i.prototype),o.prototype.constructor=o,o.prototype.getData=function(){return this._data},o.prototype.setData=function(t){return this._data=t||"",this},o.prototype.toJson=function(){return{id:this.getId(),d:this._data}},o.fromJson=function(t){if(!t.id)throw new Error("DataSubfield required json id does not exist");return new o(t.id,t.d)},n.prototype=Object.create(i.prototype),n.prototype.constructor=n,n.prototype.getId=function(){return this._id},n.prototype.getFields=function(t){return y(this._fields,t)},n.prototype.findFields=function(t){return g(this._fields,t)},n.prototype.addField=function(t){return this._fields.push(t),this},n.prototype.removeField=function(t){var r=this._fields.indexOf(t);return r>-1&&this._fields.splice(r,1),this},n.prototype.getFieldsIndex=function(){return _(this._fields)},n.prototype.toJson=function(){for(var t=[],r=[],e=0;e<this._fields.length;e++){var i=this._fields[e];i instanceof a?r.push(i):t.push(i)}return{id:this.getId(),cf:t,df:r}},n.fromJson=function(t){var r=[],e=t.cf||[],i=t.df||[],o=0;if(!Array.isArray(e))throw new Error("ExtendedSubfield json property cf must be array");if(!Array.isArray(i))throw new Error("ExtendedSubfield json property df must be array");for(o=0;o<e.length;o++)r.push(f.fromJson(e[o]));for(o=0;o<i.length;o++)r.push(a.fromJson(i[o]));return new n(t.id,r)},s.prototype.getTag=function(){return this._tag},f.prototype=Object.create(s.prototype),f.prototype.constructor=f,f.prototype.getData=function(){return this._data},f.prototype.setData=function(t){return this._data=t||"",this},f.prototype.toJson=function(){return{tag:this.getTag(),d:this._data}},f.fromJson=function(t){if(!t.tag)throw new Error("ControlField required json property tag does not exist");return new f(t.tag,t.d)},a.prototype=Object.create(s.prototype),a.prototype.constructor=a,a.prototype.setInd1=function(t){return this._i1=t||" ",p(this._i1),this},a.prototype.setInd2=function(t){return this._i2=t||" ",p(this._i2),this},a.prototype.setSubfields=function(t){return this._subfields=t||[],h(this._subfields),this},a.prototype.getSubfields=function(t){if(t){var r=[],e=0;for(e=0;e<this._subfields.length;e++){var i=this._subfields[e];i.getId()===t&&r.push(i)}return r}return this._subfields},a.prototype.addSubfield=function(t){if(!(t instanceof i))throw new Error("subfield must be Subfield instance");return this._subfields.push(t),this},a.prototype.removeSubfield=function(t){var r=this._subfields.indexOf(t);return r>-1&&t.splice(r,1),this},a.prototype.getSubfieldData=function(t){var r=[],e=0;for(e=0;e<this._subfields.length;e++){var i=this._subfields[e];i instanceof o&&i.getId()===t&&r.push(i.getData())}return r},a.prototype.getSubfieldsIndex=function(){return b(this._subfields)},a.prototype.toJson=function(){var t=[],r=[],e=0;for(e=0;e<this._subfields.length;e++){var i=this._subfields[e];i instanceof o?t.push(i):r.push(i)}return{tag:this.getTag(),i1:this._i1,i2:this._i2,sf:t,esf:r}},a.fromJson=function(t){var r=[],e=t.sf||[],i=t.esf||[],s=0;if(!Array.isArray(e))throw new Error("DataField json property sf must be array");if(!Array.isArray(i))throw new Error("DataField json property esf must be array");for(s=0;s<e.length;s++)r.push(o.fromJson(e[s]));for(s=0;s<i.length;s++)r.push(n.fromJson(i[s]));return new a(t.tag,t.i1,t.i2,r)},u.prototype.setLeader=function(t){return this._leader=t,this},u.prototype.getLeader=function(){return this._leader},u.prototype.setFields=function(t){return c(t),this._fields=t,this},u.prototype.getFields=function(t){return y(this._fields,t)},u.prototype.findFields=function(t){return g(this._fields,t)},u.prototype.addField=function(t){if(!(t instanceof s))throw new Error("field must be ControlField or DataField instance");return this._fields.push(t),this},u.prototype.removeField=function(t){if(!(t instanceof s))throw new Error("field must be ControlField or DataField instance");var r=this._fields.indexOf(t);return r>-1&&this._fields.splice(r,1),this},u.prototype.getFieldsIndex=function(){return _(this._fields)},u.prototype.toJson=function(){var t=[],r=[],e=0;for(e=0;e<this._fields.length;e++){var i=this._fields[e];i instanceof a?r.push(i):t.push(i)}return{l:this._leader.getData(),cf:t,df:r}},u.fromJson=function(t,r){if("string"==typeof t&&(t=JSON.parse(t)),"object"!=typeof t){t=JSON.parse(t);var i=new Error("json must be object or string instance");if("function"==typeof r)return r(null,i),null;throw i}var o=new e(t.l),n=[],s=t.cf||[],d=t.df||[],p=0;try{if(!Array.isArray(s))throw new Error("Record json property cf must be array");if(!Array.isArray(d))throw new Error("Record json property df must be array");for(p=0;p<s.length;p++)n.push(f.fromJson(s[p]));for(p=0;p<d.length;p++)n.push(a.fromJson(d[p]))}catch(h){if("function"==typeof r)return r(null,h),null;throw i}"function"==typeof r&&r(l,null);var l=new u(o,n);return l},r["default"]={Record:u,Leader:e,Field:s,ControlField:f,DataField:a,DataSubfield:o,ExtendedSubfield:n},t.exports=r["default"]}])});
//# sourceMappingURL=junimarc.js.map