(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,97433,(e,t,r)=>{var n={675:function(e,t){"use strict";t.byteLength=function(e){var t=l(e),r=t[0],n=t[1];return(r+n)*3/4-n},t.toByteArray=function(e){var t,r,i=l(e),a=i[0],s=i[1],u=new o((a+s)*3/4-s),c=0,f=s>0?a-4:a;for(r=0;r<f;r+=4)t=n[e.charCodeAt(r)]<<18|n[e.charCodeAt(r+1)]<<12|n[e.charCodeAt(r+2)]<<6|n[e.charCodeAt(r+3)],u[c++]=t>>16&255,u[c++]=t>>8&255,u[c++]=255&t;return 2===s&&(t=n[e.charCodeAt(r)]<<2|n[e.charCodeAt(r+1)]>>4,u[c++]=255&t),1===s&&(t=n[e.charCodeAt(r)]<<10|n[e.charCodeAt(r+1)]<<4|n[e.charCodeAt(r+2)]>>2,u[c++]=t>>8&255,u[c++]=255&t),u},t.fromByteArray=function(e){for(var t,n=e.length,o=n%3,i=[],a=0,s=n-o;a<s;a+=16383)i.push(function(e,t,n){for(var o,i=[],a=t;a<n;a+=3)o=(e[a]<<16&0xff0000)+(e[a+1]<<8&65280)+(255&e[a+2]),i.push(r[o>>18&63]+r[o>>12&63]+r[o>>6&63]+r[63&o]);return i.join("")}(e,a,a+16383>s?s:a+16383));return 1===o?i.push(r[(t=e[n-1])>>2]+r[t<<4&63]+"=="):2===o&&i.push(r[(t=(e[n-2]<<8)+e[n-1])>>10]+r[t>>4&63]+r[t<<2&63]+"="),i.join("")};for(var r=[],n=[],o="u">typeof Uint8Array?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,s=i.length;a<s;++a)r[a]=i[a],n[i.charCodeAt(a)]=a;function l(e){var t=e.length;if(t%4>0)throw Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");-1===r&&(r=t);var n=r===t?0:4-r%4;return[r,n]}n[45]=62,n[95]=63},72:function(e,t,r){"use strict";var n=r(675),o=r(783),i="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;function a(e){if(e>0x7fffffff)throw RangeError('The value "'+e+'" is invalid for option "size"');var t=new Uint8Array(e);return Object.setPrototypeOf(t,s.prototype),t}function s(e,t,r){if("number"==typeof e){if("string"==typeof t)throw TypeError('The "string" argument must be of type string. Received type number');return c(e)}return l(e,t,r)}function l(e,t,r){if("string"==typeof e){var n=e,o=t;if(("string"!=typeof o||""===o)&&(o="utf8"),!s.isEncoding(o))throw TypeError("Unknown encoding: "+o);var i=0|d(n,o),l=a(i),u=l.write(n,o);return u!==i&&(l=l.slice(0,u)),l}if(ArrayBuffer.isView(e))return f(e);if(null==e)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(C(e,ArrayBuffer)||e&&C(e.buffer,ArrayBuffer)||"u">typeof SharedArrayBuffer&&(C(e,SharedArrayBuffer)||e&&C(e.buffer,SharedArrayBuffer)))return function(e,t,r){var n;if(t<0||e.byteLength<t)throw RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw RangeError('"length" is outside of buffer bounds');return Object.setPrototypeOf(n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),s.prototype),n}(e,t,r);if("number"==typeof e)throw TypeError('The "value" argument must not be of type number. Received type number');var c=e.valueOf&&e.valueOf();if(null!=c&&c!==e)return s.from(c,t,r);var h=function(e){if(s.isBuffer(e)){var t=0|p(e.length),r=a(t);return 0===r.length||e.copy(r,0,0,t),r}return void 0!==e.length?"number"!=typeof e.length||function(e){return e!=e}(e.length)?a(0):f(e):"Buffer"===e.type&&Array.isArray(e.data)?f(e.data):void 0}(e);if(h)return h;if("u">typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return s.from(e[Symbol.toPrimitive]("string"),t,r);throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function u(e){if("number"!=typeof e)throw TypeError('"size" argument must be of type number');if(e<0)throw RangeError('The value "'+e+'" is invalid for option "size"')}function c(e){return u(e),a(e<0?0:0|p(e))}function f(e){for(var t=e.length<0?0:0|p(e.length),r=a(t),n=0;n<t;n+=1)r[n]=255&e[n];return r}t.Buffer=s,t.SlowBuffer=function(e){return+e!=e&&(e=0),s.alloc(+e)},t.INSPECT_MAX_BYTES=50,t.kMaxLength=0x7fffffff,s.TYPED_ARRAY_SUPPORT=function(){try{var e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}(),!s.TYPED_ARRAY_SUPPORT&&"u">typeof console&&"function"==typeof console.error&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}}),s.poolSize=8192,s.from=function(e,t,r){return l(e,t,r)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array),s.alloc=function(e,t,r){return(u(e),e<=0)?a(e):void 0!==t?"string"==typeof r?a(e).fill(t,r):a(e).fill(t):a(e)},s.allocUnsafe=function(e){return c(e)},s.allocUnsafeSlow=function(e){return c(e)};function p(e){if(e>=0x7fffffff)throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");return 0|e}function d(e,t){if(s.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||C(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);var r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;for(var o=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return O(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return S(e).length;default:if(o)return n?-1:O(e).length;t=(""+t).toLowerCase(),o=!0}}function h(e,t,r){var o,i,a,s=!1;if((void 0===t||t<0)&&(t=0),t>this.length||((void 0===r||r>this.length)&&(r=this.length),r<=0||(r>>>=0)<=(t>>>=0)))return"";for(e||(e="utf8");;)switch(e){case"hex":return function(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var o="",i=t;i<r;++i)o+=T[e[i]];return o}(this,t,r);case"utf8":case"utf-8":return b(this,t,r);case"ascii":return function(e,t,r){var n="";r=Math.min(e.length,r);for(var o=t;o<r;++o)n+=String.fromCharCode(127&e[o]);return n}(this,t,r);case"latin1":case"binary":return function(e,t,r){var n="";r=Math.min(e.length,r);for(var o=t;o<r;++o)n+=String.fromCharCode(e[o]);return n}(this,t,r);case"base64":return o=this,i=t,a=r,0===i&&a===o.length?n.fromByteArray(o):n.fromByteArray(o.slice(i,a));case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(e,t,r){for(var n=e.slice(t,r),o="",i=0;i<n.length;i+=2)o+=String.fromCharCode(n[i]+256*n[i+1]);return o}(this,t,r);default:if(s)throw TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),s=!0}}function g(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function m(e,t,r,n,o){var i;if(0===e.length)return -1;if("string"==typeof r?(n=r,r=0):r>0x7fffffff?r=0x7fffffff:r<-0x80000000&&(r=-0x80000000),(i=r*=1)!=i&&(r=o?0:e.length-1),r<0&&(r=e.length+r),r>=e.length)if(o)return -1;else r=e.length-1;else if(r<0)if(!o)return -1;else r=0;if("string"==typeof t&&(t=s.from(t,n)),s.isBuffer(t))return 0===t.length?-1:y(e,t,r,n,o);if("number"==typeof t){if(t&=255,"function"==typeof Uint8Array.prototype.indexOf)if(o)return Uint8Array.prototype.indexOf.call(e,t,r);else return Uint8Array.prototype.lastIndexOf.call(e,t,r);return y(e,[t],r,n,o)}throw TypeError("val must be string, number or Buffer")}function y(e,t,r,n,o){var i,a=1,s=e.length,l=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return -1;a=2,s/=2,l/=2,r/=2}function u(e,t){return 1===a?e[t]:e.readUInt16BE(t*a)}if(o){var c=-1;for(i=r;i<s;i++)if(u(e,i)===u(t,-1===c?0:i-c)){if(-1===c&&(c=i),i-c+1===l)return c*a}else -1!==c&&(i-=i-c),c=-1}else for(r+l>s&&(r=s-l),i=r;i>=0;i--){for(var f=!0,p=0;p<l;p++)if(u(e,i+p)!==u(t,p)){f=!1;break}if(f)return i}return -1}s.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==s.prototype},s.compare=function(e,t){if(C(e,Uint8Array)&&(e=s.from(e,e.offset,e.byteLength)),C(t,Uint8Array)&&(t=s.from(t,t.offset,t.byteLength)),!s.isBuffer(e)||!s.isBuffer(t))throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;for(var r=e.length,n=t.length,o=0,i=Math.min(r,n);o<i;++o)if(e[o]!==t[o]){r=e[o],n=t[o];break}return r<n?-1:+(n<r)},s.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(e,t){if(!Array.isArray(e))throw TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return s.alloc(0);if(void 0===t)for(r=0,t=0;r<e.length;++r)t+=e[r].length;var r,n=s.allocUnsafe(t),o=0;for(r=0;r<e.length;++r){var i=e[r];if(C(i,Uint8Array)&&(i=s.from(i)),!s.isBuffer(i))throw TypeError('"list" argument must be an Array of Buffers');i.copy(n,o),o+=i.length}return n},s.byteLength=d,s.prototype._isBuffer=!0,s.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)g(this,t,t+1);return this},s.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)g(this,t,t+3),g(this,t+1,t+2);return this},s.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)g(this,t,t+7),g(this,t+1,t+6),g(this,t+2,t+5),g(this,t+3,t+4);return this},s.prototype.toString=function(){var e=this.length;return 0===e?"":0==arguments.length?b(this,0,e):h.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(e){if(!s.isBuffer(e))throw TypeError("Argument must be a Buffer");return this===e||0===s.compare(this,e)},s.prototype.inspect=function(){var e="",r=t.INSPECT_MAX_BYTES;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},i&&(s.prototype[i]=s.prototype.inspect),s.prototype.compare=function(e,t,r,n,o){if(C(e,Uint8Array)&&(e=s.from(e,e.offset,e.byteLength)),!s.isBuffer(e))throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),t<0||r>e.length||n<0||o>this.length)throw RangeError("out of range index");if(n>=o&&t>=r)return 0;if(n>=o)return -1;if(t>=r)return 1;if(t>>>=0,r>>>=0,n>>>=0,o>>>=0,this===e)return 0;for(var i=o-n,a=r-t,l=Math.min(i,a),u=this.slice(n,o),c=e.slice(t,r),f=0;f<l;++f)if(u[f]!==c[f]){i=u[f],a=c[f];break}return i<a?-1:+(a<i)},s.prototype.includes=function(e,t,r){return -1!==this.indexOf(e,t,r)},s.prototype.indexOf=function(e,t,r){return m(this,e,t,r,!0)},s.prototype.lastIndexOf=function(e,t,r){return m(this,e,t,r,!1)};function b(e,t,r){r=Math.min(e.length,r);for(var n=[],o=t;o<r;){var i,a,s,l,u=e[o],c=null,f=u>239?4:u>223?3:u>191?2:1;if(o+f<=r)switch(f){case 1:u<128&&(c=u);break;case 2:(192&(i=e[o+1]))==128&&(l=(31&u)<<6|63&i)>127&&(c=l);break;case 3:i=e[o+1],a=e[o+2],(192&i)==128&&(192&a)==128&&(l=(15&u)<<12|(63&i)<<6|63&a)>2047&&(l<55296||l>57343)&&(c=l);break;case 4:i=e[o+1],a=e[o+2],s=e[o+3],(192&i)==128&&(192&a)==128&&(192&s)==128&&(l=(15&u)<<18|(63&i)<<12|(63&a)<<6|63&s)>65535&&l<1114112&&(c=l)}null===c?(c=65533,f=1):c>65535&&(c-=65536,n.push(c>>>10&1023|55296),c=56320|1023&c),n.push(c),o+=f}var p=n,d=p.length;if(d<=4096)return String.fromCharCode.apply(String,p);for(var h="",g=0;g<d;)h+=String.fromCharCode.apply(String,p.slice(g,g+=4096));return h}function w(e,t,r){if(e%1!=0||e<0)throw RangeError("offset is not uint");if(e+t>r)throw RangeError("Trying to access beyond buffer length")}function v(e,t,r,n,o,i){if(!s.isBuffer(e))throw TypeError('"buffer" argument must be a Buffer instance');if(t>o||t<i)throw RangeError('"value" argument is out of bounds');if(r+n>e.length)throw RangeError("Index out of range")}function x(e,t,r,n,o,i){if(r+n>e.length||r<0)throw RangeError("Index out of range")}function E(e,t,r,n,i){return t*=1,r>>>=0,i||x(e,t,r,4,34028234663852886e22,-34028234663852886e22),o.write(e,t,r,n,23,4),r+4}function A(e,t,r,n,i){return t*=1,r>>>=0,i||x(e,t,r,8,17976931348623157e292,-17976931348623157e292),o.write(e,t,r,n,52,8),r+8}s.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else if(isFinite(t))t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var o,i,a,s,l,u,c,f,p=this.length-t;if((void 0===r||r>p)&&(r=p),e.length>0&&(r<0||t<0)||t>this.length)throw RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var d=!1;;)switch(n){case"hex":return function(e,t,r,n){r=Number(r)||0;var o=e.length-r;n?(n=Number(n))>o&&(n=o):n=o;var i=t.length;n>i/2&&(n=i/2);for(var a=0;a<n;++a){var s,l=parseInt(t.substr(2*a,2),16);if((s=l)!=s)break;e[r+a]=l}return a}(this,e,t,r);case"utf8":case"utf-8":return o=t,i=r,P(O(e,this.length-o),this,o,i);case"ascii":return a=t,s=r,P(k(e),this,a,s);case"latin1":case"binary":return function(e,t,r,n){return P(k(t),e,r,n)}(this,e,t,r);case"base64":return l=t,u=r,P(S(e),this,l,u);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return c=t,f=r,P(function(e,t){for(var r,n,o=[],i=0;i<e.length&&!((t-=2)<0);++i)n=(r=e.charCodeAt(i))>>8,o.push(r%256),o.push(n);return o}(e,this.length-c),this,c,f);default:if(d)throw TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),d=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},s.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var n=this.subarray(e,t);return Object.setPrototypeOf(n,s.prototype),n},s.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||w(e,t,this.length);for(var n=this[e],o=1,i=0;++i<t&&(o*=256);)n+=this[e+i]*o;return n},s.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||w(e,t,this.length);for(var n=this[e+--t],o=1;t>0&&(o*=256);)n+=this[e+--t]*o;return n},s.prototype.readUInt8=function(e,t){return e>>>=0,t||w(e,1,this.length),this[e]},s.prototype.readUInt16LE=function(e,t){return e>>>=0,t||w(e,2,this.length),this[e]|this[e+1]<<8},s.prototype.readUInt16BE=function(e,t){return e>>>=0,t||w(e,2,this.length),this[e]<<8|this[e+1]},s.prototype.readUInt32LE=function(e,t){return e>>>=0,t||w(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+0x1000000*this[e+3]},s.prototype.readUInt32BE=function(e,t){return e>>>=0,t||w(e,4,this.length),0x1000000*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},s.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||w(e,t,this.length);for(var n=this[e],o=1,i=0;++i<t&&(o*=256);)n+=this[e+i]*o;return n>=(o*=128)&&(n-=Math.pow(2,8*t)),n},s.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||w(e,t,this.length);for(var n=t,o=1,i=this[e+--n];n>0&&(o*=256);)i+=this[e+--n]*o;return i>=(o*=128)&&(i-=Math.pow(2,8*t)),i},s.prototype.readInt8=function(e,t){return(e>>>=0,t||w(e,1,this.length),128&this[e])?-((255-this[e]+1)*1):this[e]},s.prototype.readInt16LE=function(e,t){e>>>=0,t||w(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?0xffff0000|r:r},s.prototype.readInt16BE=function(e,t){e>>>=0,t||w(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?0xffff0000|r:r},s.prototype.readInt32LE=function(e,t){return e>>>=0,t||w(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},s.prototype.readInt32BE=function(e,t){return e>>>=0,t||w(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},s.prototype.readFloatLE=function(e,t){return e>>>=0,t||w(e,4,this.length),o.read(this,e,!0,23,4)},s.prototype.readFloatBE=function(e,t){return e>>>=0,t||w(e,4,this.length),o.read(this,e,!1,23,4)},s.prototype.readDoubleLE=function(e,t){return e>>>=0,t||w(e,8,this.length),o.read(this,e,!0,52,8)},s.prototype.readDoubleBE=function(e,t){return e>>>=0,t||w(e,8,this.length),o.read(this,e,!1,52,8)},s.prototype.writeUIntLE=function(e,t,r,n){if(e*=1,t>>>=0,r>>>=0,!n){var o=Math.pow(2,8*r)-1;v(this,e,t,r,o,0)}var i=1,a=0;for(this[t]=255&e;++a<r&&(i*=256);)this[t+a]=e/i&255;return t+r},s.prototype.writeUIntBE=function(e,t,r,n){if(e*=1,t>>>=0,r>>>=0,!n){var o=Math.pow(2,8*r)-1;v(this,e,t,r,o,0)}var i=r-1,a=1;for(this[t+i]=255&e;--i>=0&&(a*=256);)this[t+i]=e/a&255;return t+r},s.prototype.writeUInt8=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,1,255,0),this[t]=255&e,t+1},s.prototype.writeUInt16LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},s.prototype.writeUInt16BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},s.prototype.writeUInt32LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0xffffffff,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},s.prototype.writeUInt32BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0xffffffff,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},s.prototype.writeIntLE=function(e,t,r,n){if(e*=1,t>>>=0,!n){var o=Math.pow(2,8*r-1);v(this,e,t,r,o-1,-o)}var i=0,a=1,s=0;for(this[t]=255&e;++i<r&&(a*=256);)e<0&&0===s&&0!==this[t+i-1]&&(s=1),this[t+i]=(e/a|0)-s&255;return t+r},s.prototype.writeIntBE=function(e,t,r,n){if(e*=1,t>>>=0,!n){var o=Math.pow(2,8*r-1);v(this,e,t,r,o-1,-o)}var i=r-1,a=1,s=0;for(this[t+i]=255&e;--i>=0&&(a*=256);)e<0&&0===s&&0!==this[t+i+1]&&(s=1),this[t+i]=(e/a|0)-s&255;return t+r},s.prototype.writeInt8=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},s.prototype.writeInt16LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},s.prototype.writeInt16BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},s.prototype.writeInt32LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0x7fffffff,-0x80000000),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},s.prototype.writeInt32BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0x7fffffff,-0x80000000),e<0&&(e=0xffffffff+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},s.prototype.writeFloatLE=function(e,t,r){return E(this,e,t,!0,r)},s.prototype.writeFloatBE=function(e,t,r){return E(this,e,t,!1,r)},s.prototype.writeDoubleLE=function(e,t,r){return A(this,e,t,!0,r)},s.prototype.writeDoubleBE=function(e,t,r){return A(this,e,t,!1,r)},s.prototype.copy=function(e,t,r,n){if(!s.isBuffer(e))throw TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r||0===e.length||0===this.length)return 0;if(t<0)throw RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw RangeError("Index out of range");if(n<0)throw RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var o=n-r;if(this===e&&"function"==typeof Uint8Array.prototype.copyWithin)this.copyWithin(t,r,n);else if(this===e&&r<t&&t<n)for(var i=o-1;i>=0;--i)e[i+t]=this[i+r];else Uint8Array.prototype.set.call(e,this.subarray(r,n),t);return o},s.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw TypeError("encoding must be a string");if("string"==typeof n&&!s.isEncoding(n))throw TypeError("Unknown encoding: "+n);if(1===e.length){var o,i=e.charCodeAt(0);("utf8"===n&&i<128||"latin1"===n)&&(e=i)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw RangeError("Out of range index");if(r<=t)return this;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(o=t;o<r;++o)this[o]=e;else{var a=s.isBuffer(e)?e:s.from(e,n),l=a.length;if(0===l)throw TypeError('The value "'+e+'" is invalid for argument "value"');for(o=0;o<r-t;++o)this[o+t]=a[o%l]}return this};var R=/[^+/0-9A-Za-z-_]/g;function O(e,t){t=t||1/0;for(var r,n=e.length,o=null,i=[],a=0;a<n;++a){if((r=e.charCodeAt(a))>55295&&r<57344){if(!o){if(r>56319||a+1===n){(t-=3)>-1&&i.push(239,191,189);continue}o=r;continue}if(r<56320){(t-=3)>-1&&i.push(239,191,189),o=r;continue}r=(o-55296<<10|r-56320)+65536}else o&&(t-=3)>-1&&i.push(239,191,189);if(o=null,r<128){if((t-=1)<0)break;i.push(r)}else if(r<2048){if((t-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else if(r<1114112){if((t-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}else throw Error("Invalid code point")}return i}function k(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}function S(e){return n.toByteArray(function(e){if((e=(e=e.split("=")[0]).trim().replace(R,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function P(e,t,r,n){for(var o=0;o<n&&!(o+r>=t.length)&&!(o>=e.length);++o)t[o+r]=e[o];return o}function C(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}var T=function(){for(var e="0123456789abcdef",t=Array(256),r=0;r<16;++r)for(var n=16*r,o=0;o<16;++o)t[n+o]=e[r]+e[o];return t}()},783:function(e,t){t.read=function(e,t,r,n,o){var i,a,s=8*o-n-1,l=(1<<s)-1,u=l>>1,c=-7,f=r?o-1:0,p=r?-1:1,d=e[t+f];for(f+=p,i=d&(1<<-c)-1,d>>=-c,c+=s;c>0;i=256*i+e[t+f],f+=p,c-=8);for(a=i&(1<<-c)-1,i>>=-c,c+=n;c>0;a=256*a+e[t+f],f+=p,c-=8);if(0===i)i=1-u;else{if(i===l)return a?NaN:1/0*(d?-1:1);a+=Math.pow(2,n),i-=u}return(d?-1:1)*a*Math.pow(2,i-n)},t.write=function(e,t,r,n,o,i){var a,s,l,u=8*i-o-1,c=(1<<u)-1,f=c>>1,p=5960464477539062e-23*(23===o),d=n?0:i-1,h=n?1:-1,g=+(t<0||0===t&&1/t<0);for(isNaN(t=Math.abs(t))||t===1/0?(s=+!!isNaN(t),a=c):(a=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-a))<1&&(a--,l*=2),a+f>=1?t+=p/l:t+=p*Math.pow(2,1-f),t*l>=2&&(a++,l/=2),a+f>=c?(s=0,a=c):a+f>=1?(s=(t*l-1)*Math.pow(2,o),a+=f):(s=t*Math.pow(2,f-1)*Math.pow(2,o),a=0));o>=8;e[r+d]=255&s,d+=h,s/=256,o-=8);for(a=a<<o|s,u+=o;u>0;e[r+d]=255&a,d+=h,a/=256,u-=8);e[r+d-h]|=128*g}}},o={};function i(e){var t=o[e];if(void 0!==t)return t.exports;var r=o[e]={exports:{}},a=!0;try{n[e](r,r.exports,i),a=!1}finally{a&&delete o[e]}return r.exports}i.ab="/ROOT/Desktop/projects./documind-ai-document-qa/rag/documind/frontend/node_modules/next/dist/compiled/buffer/",t.exports=i(72)},28255,e=>{"use strict";let t,r,n,o;var i,a,s,l,u=e.i(67370),c=e.i(19494),f=e.i(23202);function p(e,t){return function(){return e.apply(t,arguments)}}let{toString:d}=Object.prototype,{getPrototypeOf:h}=Object,{iterator:g,toStringTag:m}=Symbol,y=(t=Object.create(null),e=>{let r=d.call(e);return t[r]||(t[r]=r.slice(8,-1).toLowerCase())}),b=e=>(e=e.toLowerCase(),t=>y(t)===e),w=e=>t=>typeof t===e,{isArray:v}=Array,x=w("undefined");function E(e){return null!==e&&!x(e)&&null!==e.constructor&&!x(e.constructor)&&O(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}let A=b("ArrayBuffer"),R=w("string"),O=w("function"),k=w("number"),S=e=>null!==e&&"object"==typeof e,P=e=>{if("object"!==y(e))return!1;let t=h(e);return(null===t||t===Object.prototype||null===Object.getPrototypeOf(t))&&!(m in e)&&!(g in e)},C=b("Date"),T=b("File"),_=b("Blob"),j=b("FileList"),B="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:e.g,N=void 0!==B.FormData?B.FormData:void 0,U=b("URLSearchParams"),[L,D,F,I]=["ReadableStream","Request","Response","Headers"].map(b);function M(e,t,{allOwnKeys:r=!1}={}){let n,o;if(null!=e)if("object"!=typeof e&&(e=[e]),v(e))for(n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else{let o;if(E(e))return;let i=r?Object.getOwnPropertyNames(e):Object.keys(e),a=i.length;for(n=0;n<a;n++)o=i[n],t.call(null,e[o],o,e)}}function q(e,t){let r;if(E(e))return null;t=t.toLowerCase();let n=Object.keys(e),o=n.length;for(;o-- >0;)if(t===(r=n[o]).toLowerCase())return r;return null}let z="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:e.g,$=e=>!x(e)&&e!==z,H=(r="u">typeof Uint8Array&&h(Uint8Array),e=>r&&e instanceof r),W=b("HTMLFormElement"),G=(({hasOwnProperty:e})=>(t,r)=>e.call(t,r))(Object.prototype),J=b("RegExp"),V=(e,t)=>{let r=Object.getOwnPropertyDescriptors(e),n={};M(r,(r,o)=>{let i;!1!==(i=t(r,o,e))&&(n[o]=i||r)}),Object.defineProperties(e,n)},K=b("AsyncFunction"),X=(i="function"==typeof setImmediate,a=O(z.postMessage),i?setImmediate:a?(s=`axios@${Math.random()}`,l=[],z.addEventListener("message",({source:e,data:t})=>{e===z&&t===s&&l.length&&l.shift()()},!1),e=>{l.push(e),z.postMessage(s,"*")}):e=>setTimeout(e)),Q="u">typeof queueMicrotask?queueMicrotask.bind(z):void 0!==f.default&&f.default.nextTick||X,Y={isArray:v,isArrayBuffer:A,isBuffer:E,isFormData:e=>{if(!e)return!1;if(N&&e instanceof N)return!0;let t=h(e);if(!t||t===Object.prototype||!O(e.append))return!1;let r=y(e);return"formdata"===r||"object"===r&&O(e.toString)&&"[object FormData]"===e.toString()},isArrayBufferView:function(e){return"u">typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&A(e.buffer)},isString:R,isNumber:k,isBoolean:e=>!0===e||!1===e,isObject:S,isPlainObject:P,isEmptyObject:e=>{if(!S(e)||E(e))return!1;try{return 0===Object.keys(e).length&&Object.getPrototypeOf(e)===Object.prototype}catch(e){return!1}},isReadableStream:L,isRequest:D,isResponse:F,isHeaders:I,isUndefined:x,isDate:C,isFile:T,isReactNativeBlob:e=>!!(e&&void 0!==e.uri),isReactNative:e=>e&&void 0!==e.getParts,isBlob:_,isRegExp:J,isFunction:O,isStream:e=>S(e)&&O(e.pipe),isURLSearchParams:U,isTypedArray:H,isFileList:j,forEach:M,merge:function e(...t){let{caseless:r,skipUndefined:n}=$(this)&&this||{},o={},i=(t,i)=>{if("__proto__"===i||"constructor"===i||"prototype"===i)return;let a=r&&q(o,i)||i,s=G(o,a)?o[a]:void 0;P(s)&&P(t)?o[a]=e(s,t):P(t)?o[a]=e({},t):v(t)?o[a]=t.slice():n&&x(t)||(o[a]=t)};for(let e=0,r=t.length;e<r;e++)t[e]&&M(t[e],i);return o},extend:(e,t,r,{allOwnKeys:n}={})=>(M(t,(t,n)=>{r&&O(t)?Object.defineProperty(e,n,{__proto__:null,value:p(t,r),writable:!0,enumerable:!0,configurable:!0}):Object.defineProperty(e,n,{__proto__:null,value:t,writable:!0,enumerable:!0,configurable:!0})},{allOwnKeys:n}),e),trim:e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""),stripBOM:e=>(65279===e.charCodeAt(0)&&(e=e.slice(1)),e),inherits:(e,t,r,n)=>{e.prototype=Object.create(t.prototype,n),Object.defineProperty(e.prototype,"constructor",{__proto__:null,value:e,writable:!0,enumerable:!1,configurable:!0}),Object.defineProperty(e,"super",{__proto__:null,value:t.prototype}),r&&Object.assign(e.prototype,r)},toFlatObject:(e,t,r,n)=>{let o,i,a,s={};if(t=t||{},null==e)return t;do{for(i=(o=Object.getOwnPropertyNames(e)).length;i-- >0;)a=o[i],(!n||n(a,e,t))&&!s[a]&&(t[a]=e[a],s[a]=!0);e=!1!==r&&h(e)}while(e&&(!r||r(e,t))&&e!==Object.prototype)return t},kindOf:y,kindOfTest:b,endsWith:(e,t,r)=>{e=String(e),(void 0===r||r>e.length)&&(r=e.length),r-=t.length;let n=e.indexOf(t,r);return -1!==n&&n===r},toArray:e=>{if(!e)return null;if(v(e))return e;let t=e.length;if(!k(t))return null;let r=Array(t);for(;t-- >0;)r[t]=e[t];return r},forEachEntry:(e,t)=>{let r,n=(e&&e[g]).call(e);for(;(r=n.next())&&!r.done;){let n=r.value;t.call(e,n[0],n[1])}},matchAll:(e,t)=>{let r,n=[];for(;null!==(r=e.exec(t));)n.push(r);return n},isHTMLForm:W,hasOwnProperty:G,hasOwnProp:G,reduceDescriptors:V,freezeMethods:e=>{V(e,(t,r)=>{if(O(e)&&["arguments","caller","callee"].includes(r))return!1;if(O(e[r])){if(t.enumerable=!1,"writable"in t){t.writable=!1;return}t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+r+"'")})}})},toObjectSet:(e,t)=>{let r={};return(v(e)?e:String(e).split(t)).forEach(e=>{r[e]=!0}),r},toCamelCase:e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(e,t,r){return t.toUpperCase()+r}),noop:()=>{},toFiniteNumber:(e,t)=>null!=e&&Number.isFinite(e*=1)?e:t,findKey:q,global:z,isContextDefined:$,isSpecCompliantForm:function(e){return!!(e&&O(e.append)&&"FormData"===e[m]&&e[g])},toJSONObject:e=>{let t=new WeakSet,r=e=>{if(S(e)){if(t.has(e))return;if(E(e))return e;if(!("toJSON"in e)){t.add(e);let n=v(e)?[]:{};return M(e,(e,t)=>{let o=r(e);x(o)||(n[t]=o)}),t.delete(e),n}}return e};return r(e)},isAsyncFn:K,isThenable:e=>e&&(S(e)||O(e))&&O(e.then)&&O(e.catch),setImmediate:X,asap:Q,isIterable:e=>null!=e&&O(e[g])};var Z=e.i(97433);let ee=Y.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),et=RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+","g"),er=RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+","g");function en(e,t){return Y.isArray(e)?e.map(e=>en(e,t)):function(e){let t=0,r=e.length;for(;t<r;){let r=e.charCodeAt(t);if(9!==r&&32!==r)break;t+=1}for(;r>t;){let t=e.charCodeAt(r-1);if(9!==t&&32!==t)break;r-=1}return 0===t&&r===e.length?e:e.slice(t,r)}(String(e).replace(t,""))}function eo(e){let t=Object.create(null);return Y.forEach(e.toJSON(),(e,r)=>{t[r]=en(e,er)}),t}let ei=Symbol("internals");function ea(e){return e&&String(e).trim().toLowerCase()}function es(e){return!1===e||null==e?e:Y.isArray(e)?e.map(es):en(String(e),et)}function el(e,t,r,n,o){if(Y.isFunction(n))return n.call(this,t,r);if(o&&(t=r),Y.isString(t)){if(Y.isString(n))return -1!==t.indexOf(n);if(Y.isRegExp(n))return n.test(t)}}class eu{constructor(e){e&&this.set(e)}set(e,t,r){let n=this;function o(e,t,r){let o=ea(t);if(!o)throw Error("header name must be a non-empty string");let i=Y.findKey(n,o);i&&void 0!==n[i]&&!0!==r&&(void 0!==r||!1===n[i])||(n[i||t]=es(e))}let i=(e,t)=>Y.forEach(e,(e,r)=>o(e,r,t));if(Y.isPlainObject(e)||e instanceof this.constructor)i(e,t);else{let n;if(Y.isString(e)&&(e=e.trim())&&(n=e,!/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(n.trim()))){var a;let r,n,o,s;i((s={},(a=e)&&a.split("\n").forEach(function(e){o=e.indexOf(":"),r=e.substring(0,o).trim().toLowerCase(),n=e.substring(o+1).trim(),!r||s[r]&&ee[r]||("set-cookie"===r?s[r]?s[r].push(n):s[r]=[n]:s[r]=s[r]?s[r]+", "+n:n)}),s),t)}else if(Y.isObject(e)&&Y.isIterable(e)){let r={},n,o;for(let t of e){if(!Y.isArray(t))throw TypeError("Object iterator must return a key-value pair");r[o=t[0]]=(n=r[o])?Y.isArray(n)?[...n,t[1]]:[n,t[1]]:t[1]}i(r,t)}else null!=e&&o(t,e,r)}return this}get(e,t){if(e=ea(e)){let r=Y.findKey(this,e);if(r){let e=this[r];if(!t)return e;if(!0===t){let t,r=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;for(;t=n.exec(e);)r[t[1]]=t[2];return r}if(Y.isFunction(t))return t.call(this,e,r);if(Y.isRegExp(t))return t.exec(e);throw TypeError("parser must be boolean|regexp|function")}}}has(e,t){if(e=ea(e)){let r=Y.findKey(this,e);return!!(r&&void 0!==this[r]&&(!t||el(this,this[r],r,t)))}return!1}delete(e,t){let r=this,n=!1;function o(e){if(e=ea(e)){let o=Y.findKey(r,e);o&&(!t||el(r,r[o],o,t))&&(delete r[o],n=!0)}}return Y.isArray(e)?e.forEach(o):o(e),n}clear(e){let t=Object.keys(this),r=t.length,n=!1;for(;r--;){let o=t[r];(!e||el(this,this[o],o,e,!0))&&(delete this[o],n=!0)}return n}normalize(e){let t=this,r={};return Y.forEach(this,(n,o)=>{let i=Y.findKey(r,o);if(i){t[i]=es(n),delete t[o];return}let a=e?o.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(e,t,r)=>t.toUpperCase()+r):String(o).trim();a!==o&&delete t[o],t[a]=es(n),r[a]=!0}),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){let t=Object.create(null);return Y.forEach(this,(r,n)=>{null!=r&&!1!==r&&(t[n]=e&&Y.isArray(r)?r.join(", "):r)}),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([e,t])=>e+": "+t).join("\n")}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static concat(e,...t){let r=new this(e);return t.forEach(e=>r.set(e)),r}static accessor(e){let t=(this[ei]=this[ei]={accessors:{}}).accessors,r=this.prototype;function n(e){let n=ea(e);if(!t[n]){let o;o=Y.toCamelCase(" "+e),["get","set","has"].forEach(t=>{Object.defineProperty(r,t+o,{__proto__:null,value:function(r,n,o){return this[t].call(this,e,r,n,o)},configurable:!0})}),t[n]=!0}}return Y.isArray(e)?e.forEach(n):n(e),this}}eu.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]),Y.reduceDescriptors(eu.prototype,({value:e},t)=>{let r=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(e){this[r]=e}}}),Y.freezeMethods(eu);class ec extends Error{static from(e,t,r,n,o,i){let a=new ec(e.message,t||e.code,r,n,o);return a.cause=e,a.name=e.name,null!=e.status&&null==a.status&&(a.status=e.status),i&&Object.assign(a,i),a}constructor(e,t,r,n,o){super(e),Object.defineProperty(this,"message",{__proto__:null,value:e,enumerable:!0,writable:!0,configurable:!0}),this.name="AxiosError",this.isAxiosError=!0,t&&(this.code=t),r&&(this.config=r),n&&(this.request=n),o&&(this.response=o,this.status=o.status)}toJSON(){let e,t,r,n=this.config,o=n&&Y.hasOwnProp(n,"redact")?n.redact:void 0,i=Y.isArray(o)&&o.length>0?(e=new Set(o.map(e=>String(e).toLowerCase())),t=[],(r=n=>{let o;if(null===n||"object"!=typeof n||Y.isBuffer(n))return n;if(-1===t.indexOf(n)){if(n instanceof eu&&(n=n.toJSON()),t.push(n),Y.isArray(n))o=[],n.forEach((e,t)=>{let n=r(e);Y.isUndefined(n)||(o[t]=n)});else{if(!Y.isPlainObject(n)&&function(e){if(Y.hasOwnProp(e,"toJSON"))return!0;let t=Object.getPrototypeOf(e);for(;t&&t!==Object.prototype;){if(Y.hasOwnProp(t,"toJSON"))return!0;t=Object.getPrototypeOf(t)}return!1}(n))return t.pop(),n;for(let[t,i]of(o=Object.create(null),Object.entries(n))){let n=e.has(t.toLowerCase())?"[REDACTED ****]":r(i);Y.isUndefined(n)||(o[t]=n)}}return t.pop(),o}})(n)):Y.toJSONObject(n);return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:i,code:this.code,status:this.status}}}ec.ERR_BAD_OPTION_VALUE="ERR_BAD_OPTION_VALUE",ec.ERR_BAD_OPTION="ERR_BAD_OPTION",ec.ECONNABORTED="ECONNABORTED",ec.ETIMEDOUT="ETIMEDOUT",ec.ECONNREFUSED="ECONNREFUSED",ec.ERR_NETWORK="ERR_NETWORK",ec.ERR_FR_TOO_MANY_REDIRECTS="ERR_FR_TOO_MANY_REDIRECTS",ec.ERR_DEPRECATED="ERR_DEPRECATED",ec.ERR_BAD_RESPONSE="ERR_BAD_RESPONSE",ec.ERR_BAD_REQUEST="ERR_BAD_REQUEST",ec.ERR_CANCELED="ERR_CANCELED",ec.ERR_NOT_SUPPORT="ERR_NOT_SUPPORT",ec.ERR_INVALID_URL="ERR_INVALID_URL",ec.ERR_FORM_DATA_DEPTH_EXCEEDED="ERR_FORM_DATA_DEPTH_EXCEEDED";let ef=ec;function ep(e){return Y.isPlainObject(e)||Y.isArray(e)}function ed(e){return Y.endsWith(e,"[]")?e.slice(0,-2):e}function eh(e,t,r){return e?e.concat(t).map(function(e,t){return e=ed(e),!r&&t?"["+e+"]":e}).join(r?".":""):t}let eg=Y.toFlatObject(Y,{},null,function(e){return/^is[A-Z]/.test(e)}),em=function(e,t,r){if(!Y.isObject(e))throw TypeError("target must be an object");t=t||new FormData;let n=(r=Y.toFlatObject(r,{metaTokens:!0,dots:!1,indexes:!1},!1,function(e,t){return!Y.isUndefined(t[e])})).metaTokens,o=r.visitor||f,i=r.dots,a=r.indexes,s=r.Blob||"u">typeof Blob&&Blob,l=void 0===r.maxDepth?100:r.maxDepth,u=s&&Y.isSpecCompliantForm(t);if(!Y.isFunction(o))throw TypeError("visitor must be a function");function c(e){if(null===e)return"";if(Y.isDate(e))return e.toISOString();if(Y.isBoolean(e))return e.toString();if(!u&&Y.isBlob(e))throw new ef("Blob is not supported. Use a Buffer instead.");return Y.isArrayBuffer(e)||Y.isTypedArray(e)?u&&"function"==typeof Blob?new Blob([e]):Z.Buffer.from(e):e}function f(e,r,o){let s=e;if(Y.isReactNative(t)&&Y.isReactNativeBlob(e))return t.append(eh(o,r,i),c(e)),!1;if(e&&!o&&"object"==typeof e)if(Y.endsWith(r,"{}"))r=n?r:r.slice(0,-2),e=JSON.stringify(e);else{var l;if(Y.isArray(e)&&(l=e,Y.isArray(l)&&!l.some(ep))||(Y.isFileList(e)||Y.endsWith(r,"[]"))&&(s=Y.toArray(e)))return r=ed(r),s.forEach(function(e,n){Y.isUndefined(e)||null===e||t.append(!0===a?eh([r],n,i):null===a?r:r+"[]",c(e))}),!1}return!!ep(e)||(t.append(eh(o,r,i),c(e)),!1)}let p=[],d=Object.assign(eg,{defaultVisitor:f,convertValue:c,isVisitable:ep});if(!Y.isObject(e))throw TypeError("data must be an object");return!function e(r,n,i=0){if(!Y.isUndefined(r)){if(i>l)throw new ef("Object is too deeply nested ("+i+" levels). Max depth: "+l,ef.ERR_FORM_DATA_DEPTH_EXCEEDED);if(-1!==p.indexOf(r))throw Error("Circular reference detected in "+n.join("."));p.push(r),Y.forEach(r,function(r,a){!0===(!(Y.isUndefined(r)||null===r)&&o.call(t,r,Y.isString(a)?a.trim():a,n,d))&&e(r,n?n.concat(a):[a],i+1)}),p.pop()}}(e),t};function ey(e){let t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"};return encodeURIComponent(e).replace(/[!'()~]|%20/g,function(e){return t[e]})}function eb(e,t){this._pairs=[],e&&em(e,this,t)}let ew=eb.prototype;function ev(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function ex(e,t,r){let n;if(!t)return e;let o=r&&r.encode||ev,i=Y.isFunction(r)?{serialize:r}:r,a=i&&i.serialize;if(n=a?a(t,i):Y.isURLSearchParams(t)?t.toString():new eb(t,i).toString(o)){let t=e.indexOf("#");-1!==t&&(e=e.slice(0,t)),e+=(-1===e.indexOf("?")?"?":"&")+n}return e}ew.append=function(e,t){this._pairs.push([e,t])},ew.toString=function(e){let t=e?function(t){return e.call(this,t,ey)}:ey;return this._pairs.map(function(e){return t(e[0])+"="+t(e[1])},"").join("&")};let eE=class{constructor(){this.handlers=[]}use(e,t,r){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!r&&r.synchronous,runWhen:r?r.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(e){Y.forEach(this.handlers,function(t){null!==t&&e(t)})}},eA={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1,legacyInterceptorReqResOrdering:!0},eR="u">typeof URLSearchParams?URLSearchParams:eb,eO="u">typeof FormData?FormData:null,ek="u">typeof Blob?Blob:null,eS="u">typeof window&&"u">typeof document,eP="object"==typeof navigator&&navigator||void 0,eC=eS&&(!eP||0>["ReactNative","NativeScript","NS"].indexOf(eP.product)),eT="u">typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&"function"==typeof self.importScripts,e_=eS&&window.location.href||"http://localhost";e.s(["hasBrowserEnv",0,eS,"hasStandardBrowserEnv",0,eC,"hasStandardBrowserWebWorkerEnv",0,eT,"navigator",0,eP,"origin",0,e_],17514);let ej={...e.i(17514),isBrowser:!0,classes:{URLSearchParams:eR,FormData:eO,Blob:ek},protocols:["http","https","file","blob","url","data"]},eB=function(e){if(Y.isFormData(e)&&Y.isFunction(e.entries)){let t={};return Y.forEachEntry(e,(e,r)=>{!function e(t,r,n,o){let i=t[o++];if("__proto__"===i)return!0;let a=Number.isFinite(+i),s=o>=t.length;return(i=!i&&Y.isArray(n)?n.length:i,s)?Y.hasOwnProp(n,i)?n[i]=Y.isArray(n[i])?n[i].concat(r):[n[i],r]:n[i]=r:(Y.hasOwnProp(n,i)&&Y.isObject(n[i])||(n[i]=[]),e(t,r,n[i],o)&&Y.isArray(n[i])&&(n[i]=function(e){let t,r,n={},o=Object.keys(e),i=o.length;for(t=0;t<i;t++)n[r=o[t]]=e[r];return n}(n[i]))),!a}(Y.matchAll(/\w+|\[(\w*)]/g,e).map(e=>"[]"===e[0]?"":e[1]||e[0]),r,t,0)}),t}return null},eN=(e,t)=>null!=e&&Y.hasOwnProp(e,t)?e[t]:void 0,eU={transitional:eA,adapter:["xhr","http","fetch"],transformRequest:[function(e,t){let r,n=t.getContentType()||"",o=n.indexOf("application/json")>-1,i=Y.isObject(e);if(i&&Y.isHTMLForm(e)&&(e=new FormData(e)),Y.isFormData(e))return o?JSON.stringify(eB(e)):e;if(Y.isArrayBuffer(e)||Y.isBuffer(e)||Y.isStream(e)||Y.isFile(e)||Y.isBlob(e)||Y.isReadableStream(e))return e;if(Y.isArrayBufferView(e))return e.buffer;if(Y.isURLSearchParams(e))return t.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();if(i){let t=eN(this,"formSerializer");if(n.indexOf("application/x-www-form-urlencoded")>-1)return em(e,new ej.classes.URLSearchParams,{visitor:function(e,t,r,n){return ej.isNode&&Y.isBuffer(e)?(this.append(t,e.toString("base64")),!1):n.defaultVisitor.apply(this,arguments)},...t}).toString();if((r=Y.isFileList(e))||n.indexOf("multipart/form-data")>-1){let n=eN(this,"env"),o=n&&n.FormData;return em(r?{"files[]":e}:e,o&&new o,t)}}if(i||o){t.setContentType("application/json",!1);var a=e;if(Y.isString(a))try{return(0,JSON.parse)(a),Y.trim(a)}catch(e){if("SyntaxError"!==e.name)throw e}return(0,JSON.stringify)(a)}return e}],transformResponse:[function(e){let t=eN(this,"transitional")||eU.transitional,r=t&&t.forcedJSONParsing,n=eN(this,"responseType"),o="json"===n;if(Y.isResponse(e)||Y.isReadableStream(e))return e;if(e&&Y.isString(e)&&(r&&!n||o)){let r=t&&t.silentJSONParsing;try{return JSON.parse(e,eN(this,"parseReviver"))}catch(e){if(!r&&o){if("SyntaxError"===e.name)throw ef.from(e,ef.ERR_BAD_RESPONSE,this,null,eN(this,"response"));throw e}}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:ej.classes.FormData,Blob:ej.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};function eL(e,t){let r=this||eU,n=t||r,o=eu.from(n.headers),i=n.data;return Y.forEach(e,function(e){i=e.call(r,i,o.normalize(),t?t.status:void 0)}),o.normalize(),i}function eD(e){return!!(e&&e.__CANCEL__)}Y.forEach(["delete","get","head","post","put","patch","query"],e=>{eU.headers[e]={}});let eF=class extends ef{constructor(e,t,r){super(null==e?"canceled":e,ef.ERR_CANCELED,t,r),this.name="CanceledError",this.__CANCEL__=!0}};function eI(e,t,r){let n=r.config.validateStatus;!r.status||!n||n(r.status)?e(r):t(new ef("Request failed with status code "+r.status,r.status>=400&&r.status<500?ef.ERR_BAD_REQUEST:ef.ERR_BAD_RESPONSE,r.config,r.request,r))}let eM=function(e,t){let r,n=Array(e=e||10),o=Array(e),i=0,a=0;return t=void 0!==t?t:1e3,function(s){let l=Date.now(),u=o[a];r||(r=l),n[i]=s,o[i]=l;let c=a,f=0;for(;c!==i;)f+=n[c++],c%=e;if((i=(i+1)%e)===a&&(a=(a+1)%e),l-r<t)return;let p=u&&l-u;return p?Math.round(1e3*f/p):void 0}},eq=function(e,t){let r,n,o=0,i=1e3/t,a=(t,i=Date.now())=>{o=i,r=null,n&&(clearTimeout(n),n=null),e(...t)};return[(...e)=>{let t=Date.now(),s=t-o;s>=i?a(e,t):(r=e,n||(n=setTimeout(()=>{n=null,a(r)},i-s)))},()=>r&&a(r)]},ez=(e,t,r=3)=>{let n=0,o=eM(50,250);return eq(r=>{if(!r||"number"!=typeof r.loaded)return;let i=r.loaded,a=r.lengthComputable?r.total:void 0,s=null!=a?Math.min(i,a):i,l=Math.max(0,s-n),u=o(l);n=Math.max(n,s),e({loaded:s,total:a,progress:a?s/a:void 0,bytes:l,rate:u||void 0,estimated:u&&a?(a-s)/u:void 0,event:r,lengthComputable:null!=a,[t?"download":"upload"]:!0})},r)},e$=(e,t)=>{let r=null!=e;return[n=>t[0]({lengthComputable:r,total:e,loaded:n}),t[1]]},eH=e=>(...t)=>Y.asap(()=>e(...t)),eW=ej.hasStandardBrowserEnv?(n=new URL(ej.origin),o=ej.navigator&&/(msie|trident)/i.test(ej.navigator.userAgent),e=>(e=new URL(e,ej.origin),n.protocol===e.protocol&&n.host===e.host&&(o||n.port===e.port))):()=>!0,eG=ej.hasStandardBrowserEnv?{write(e,t,r,n,o,i,a){if("u"<typeof document)return;let s=[`${e}=${encodeURIComponent(t)}`];Y.isNumber(r)&&s.push(`expires=${new Date(r).toUTCString()}`),Y.isString(n)&&s.push(`path=${n}`),Y.isString(o)&&s.push(`domain=${o}`),!0===i&&s.push("secure"),Y.isString(a)&&s.push(`SameSite=${a}`),document.cookie=s.join("; ")},read(e){if("u"<typeof document)return null;let t=document.cookie.split(";");for(let r=0;r<t.length;r++){let n=t[r].replace(/^\s+/,""),o=n.indexOf("=");if(-1!==o&&n.slice(0,o)===e)return decodeURIComponent(n.slice(o+1))}return null},remove(e){this.write(e,"",Date.now()-864e5,"/")}}:{write(){},read:()=>null,remove(){}};function eJ(e,t,r){let n=!("string"==typeof t&&/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t));return e&&(n||!1===r)?t?e.replace(/\/?\/$/,"")+"/"+t.replace(/^\/+/,""):e:t}let eV=e=>e instanceof eu?{...e}:e;function eK(e,t){t=t||{};let r=Object.create(null);function n(e,t,r,n){return Y.isPlainObject(e)&&Y.isPlainObject(t)?Y.merge.call({caseless:n},e,t):Y.isPlainObject(t)?Y.merge({},t):Y.isArray(t)?t.slice():t}function o(e,t,r,o){return Y.isUndefined(t)?Y.isUndefined(e)?void 0:n(void 0,e,r,o):n(e,t,r,o)}function i(e,t){if(!Y.isUndefined(t))return n(void 0,t)}function a(e,t){return Y.isUndefined(t)?Y.isUndefined(e)?void 0:n(void 0,e):n(void 0,t)}function s(r,o,i){return Y.hasOwnProp(t,i)?n(r,o):Y.hasOwnProp(e,i)?n(void 0,r):void 0}Object.defineProperty(r,"hasOwnProperty",{__proto__:null,value:Object.prototype.hasOwnProperty,enumerable:!1,writable:!0,configurable:!0});let l={url:i,method:i,data:i,baseURL:a,transformRequest:a,transformResponse:a,paramsSerializer:a,timeout:a,timeoutMessage:a,withCredentials:a,withXSRFToken:a,adapter:a,responseType:a,xsrfCookieName:a,xsrfHeaderName:a,onUploadProgress:a,onDownloadProgress:a,decompress:a,maxContentLength:a,maxBodyLength:a,beforeRedirect:a,transport:a,httpAgent:a,httpsAgent:a,cancelToken:a,socketPath:a,allowedSocketPaths:a,responseEncoding:a,validateStatus:s,headers:(e,t,r)=>o(eV(e),eV(t),r,!0)};return Y.forEach(Object.keys({...e,...t}),function(n){if("__proto__"===n||"constructor"===n||"prototype"===n)return;let i=Y.hasOwnProp(l,n)?l[n]:o,a=i(Y.hasOwnProp(e,n)?e[n]:void 0,Y.hasOwnProp(t,n)?t[n]:void 0,n);Y.isUndefined(a)&&i!==s||(r[n]=a)}),r}let eX=["content-type","content-length"],eQ=e=>{let t=eK({},e),r=e=>Y.hasOwnProp(t,e)?t[e]:void 0,n=r("data"),o=r("withXSRFToken"),i=r("xsrfHeaderName"),a=r("xsrfCookieName"),s=r("headers"),l=r("auth"),u=r("baseURL"),c=r("allowAbsoluteUrls"),f=r("url");if(t.headers=s=eu.from(s),t.url=ex(eJ(u,f,c),e.params,e.paramsSerializer),l&&s.set("Authorization","Basic "+btoa((l.username||"")+":"+(l.password?encodeURIComponent(l.password).replace(/%([0-9A-F]{2})/gi,(e,t)=>String.fromCharCode(parseInt(t,16))):""))),Y.isFormData(n))if(ej.hasStandardBrowserEnv||ej.hasStandardBrowserWebWorkerEnv)s.setContentType(void 0);else{var p,d;Y.isFunction(n.getHeaders)&&(p=s,d=n.getHeaders(),"content-only"!==r("formDataHeaderPolicy")?p.set(d):Object.entries(d).forEach(([e,t])=>{eX.includes(e.toLowerCase())&&p.set(e,t)}))}if(ej.hasStandardBrowserEnv&&(Y.isFunction(o)&&(o=o(t)),!0===o||null==o&&eW(t.url))){let e=i&&a&&eG.read(a);e&&s.set(i,e)}return t},eY="u">typeof XMLHttpRequest&&function(e){return new Promise(function(t,r){var n;let o,i,a,s,l,u,c=eQ(e),f=c.data,p=eu.from(c.headers).normalize(),{responseType:d,onUploadProgress:h,onDownloadProgress:g}=c;function m(){s&&s(),l&&l(),c.cancelToken&&c.cancelToken.unsubscribe(o),c.signal&&c.signal.removeEventListener("abort",o)}let y=new XMLHttpRequest;function b(){if(!y)return;let n=eu.from("getAllResponseHeaders"in y&&y.getAllResponseHeaders());eI(function(e){t(e),m()},function(e){r(e),m()},{data:d&&"text"!==d&&"json"!==d?y.response:y.responseText,status:y.status,statusText:y.statusText,headers:n,config:e,request:y}),y=null}y.open(c.method.toUpperCase(),c.url,!0),y.timeout=c.timeout,"onloadend"in y?y.onloadend=b:y.onreadystatechange=function(){!y||4!==y.readyState||(0!==y.status||y.responseURL&&y.responseURL.startsWith("file:"))&&setTimeout(b)},y.onabort=function(){y&&(r(new ef("Request aborted",ef.ECONNABORTED,e,y)),m(),y=null)},y.onerror=function(t){let n=new ef(t&&t.message?t.message:"Network Error",ef.ERR_NETWORK,e,y);n.event=t||null,r(n),m(),y=null},y.ontimeout=function(){let t=c.timeout?"timeout of "+c.timeout+"ms exceeded":"timeout exceeded",n=c.transitional||eA;c.timeoutErrorMessage&&(t=c.timeoutErrorMessage),r(new ef(t,n.clarifyTimeoutError?ef.ETIMEDOUT:ef.ECONNABORTED,e,y)),m(),y=null},void 0===f&&p.setContentType(null),"setRequestHeader"in y&&Y.forEach(eo(p),function(e,t){y.setRequestHeader(t,e)}),Y.isUndefined(c.withCredentials)||(y.withCredentials=!!c.withCredentials),d&&"json"!==d&&(y.responseType=c.responseType),g&&([a,l]=ez(g,!0),y.addEventListener("progress",a)),h&&y.upload&&([i,s]=ez(h),y.upload.addEventListener("progress",i),y.upload.addEventListener("loadend",s)),(c.cancelToken||c.signal)&&(o=t=>{y&&(r(!t||t.type?new eF(null,e,y):t),y.abort(),m(),y=null)},c.cancelToken&&c.cancelToken.subscribe(o),c.signal&&(c.signal.aborted?o():c.signal.addEventListener("abort",o)));let w=(n=c.url,(u=/^([-+\w]{1,25}):(?:\/\/)?/.exec(n))&&u[1]||"");w&&!ej.protocols.includes(w)?r(new ef("Unsupported protocol "+w+":",ef.ERR_BAD_REQUEST,e)):y.send(f||null)})},eZ=function*(e,t){let r,n=e.byteLength;if(!t||n<t)return void(yield e);let o=0;for(;o<n;)r=o+t,yield e.slice(o,r),o=r},e0=async function*(e,t){for await(let r of e1(e))yield*eZ(r,t)},e1=async function*(e){if(e[Symbol.asyncIterator])return void(yield*e);let t=e.getReader();try{for(;;){let{done:e,value:r}=await t.read();if(e)break;yield r}}finally{await t.cancel()}},e2=(e,t,r,n)=>{let o,i=e0(e,t),a=0,s=e=>{!o&&(o=!0,n&&n(e))};return new ReadableStream({async pull(e){try{let{done:t,value:n}=await i.next();if(t){s(),e.close();return}let o=n.byteLength;if(r){let e=a+=o;r(e)}e.enqueue(new Uint8Array(n))}catch(e){throw s(e),e}},cancel:e=>(s(e),i.return())},{highWaterMark:2})},e5="1.16.1",{isFunction:e6}=Y,e8=(e,...t)=>{try{return!!e(...t)}catch(e){return!1}},e3=e=>{let t,r=void 0!==Y.global&&null!==Y.global?Y.global:globalThis,{ReadableStream:n,TextEncoder:o}=r,{fetch:i,Request:a,Response:s}=e=Y.merge.call({skipUndefined:!0},{Request:r.Request,Response:r.Response},e),l=i?e6(i):"function"==typeof fetch,u=e6(a),c=e6(s);if(!l)return!1;let f=l&&e6(n),p=l&&("function"==typeof o?(t=new o,e=>t.encode(e)):async e=>new Uint8Array(await new a(e).arrayBuffer())),d=u&&f&&e8(()=>{let e=!1,t=new a(ej.origin,{body:new n,method:"POST",get duplex(){return e=!0,"half"}}),r=t.headers.has("Content-Type");return null!=t.body&&t.body.cancel(),e&&!r}),h=c&&f&&e8(()=>Y.isReadableStream(new s("").body)),g={stream:h&&(e=>e.body)};l&&["text","arrayBuffer","blob","formData","stream"].forEach(e=>{g[e]||(g[e]=(t,r)=>{let n=t&&t[e];if(n)return n.call(t);throw new ef(`Response type '${e}' is not supported`,ef.ERR_NOT_SUPPORT,r)})});let m=async e=>{if(null==e)return 0;if(Y.isBlob(e))return e.size;if(Y.isSpecCompliantForm(e)){let t=new a(ej.origin,{method:"POST",body:e});return(await t.arrayBuffer()).byteLength}return Y.isArrayBufferView(e)||Y.isArrayBuffer(e)?e.byteLength:(Y.isURLSearchParams(e)&&(e+=""),Y.isString(e))?(await p(e)).byteLength:void 0},y=async(e,t)=>{let r=Y.toFiniteNumber(e.getContentLength());return null==r?m(t):r};return async e=>{let t,{url:r,method:n,data:l,signal:c,cancelToken:f,timeout:p,onDownloadProgress:m,onUploadProgress:b,responseType:w,headers:v,withCredentials:x="same-origin",fetchOptions:E,maxContentLength:A,maxBodyLength:R}=eQ(e),O=Y.isNumber(A)&&A>-1,k=Y.isNumber(R)&&R>-1,S=i||fetch;w=w?(w+"").toLowerCase():"text";let P=((e,t)=>{if(e=e?e.filter(Boolean):[],!t&&!e.length)return;let r=new AbortController,n=!1,o=function(e){if(!n){n=!0,a();let t=e instanceof Error?e:this.reason;r.abort(t instanceof ef?t:new eF(t instanceof Error?t.message:t))}},i=t&&setTimeout(()=>{i=null,o(new ef(`timeout of ${t}ms exceeded`,ef.ETIMEDOUT))},t),a=()=>{e&&(i&&clearTimeout(i),i=null,e.forEach(e=>{e.unsubscribe?e.unsubscribe(o):e.removeEventListener("abort",o)}),e=null)};e.forEach(e=>e.addEventListener("abort",o));let{signal:s}=r;return s.unsubscribe=()=>Y.asap(a),s})([c,f&&f.toAbortSignal()],p),C=null,T=P&&P.unsubscribe&&(()=>{P.unsubscribe()});try{if(O&&"string"==typeof r&&r.startsWith("data:")&&function(e){if(!e||"string"!=typeof e||!e.startsWith("data:"))return 0;let t=e.indexOf(",");if(t<0)return 0;let r=e.slice(5,t),n=e.slice(t+1);if(/;base64/i.test(r)){let e=n.length,t=n.length;for(let r=0;r<t;r++)if(37===n.charCodeAt(r)&&r+2<t){let t=n.charCodeAt(r+1),o=n.charCodeAt(r+2);(t>=48&&t<=57||t>=65&&t<=70||t>=97&&t<=102)&&(o>=48&&o<=57||o>=65&&o<=70||o>=97&&o<=102)&&(e-=2,r+=2)}let r=0,o=t-1,i=e=>e>=2&&37===n.charCodeAt(e-2)&&51===n.charCodeAt(e-1)&&(68===n.charCodeAt(e)||100===n.charCodeAt(e));o>=0&&(61===n.charCodeAt(o)?(r++,o--):i(o)&&(r++,o-=3)),1===r&&o>=0&&(61===n.charCodeAt(o)?r++:i(o)&&r++);let a=3*Math.floor(e/4)-(r||0);return a>0?a:0}if(void 0!==Z.Buffer&&"function"==typeof Z.Buffer.byteLength)return Z.Buffer.byteLength(n,"utf8");let o=0;for(let e=0,t=n.length;e<t;e++){let r=n.charCodeAt(e);if(r<128)o+=1;else if(r<2048)o+=2;else if(r>=55296&&r<=56319&&e+1<t){let t=n.charCodeAt(e+1);t>=56320&&t<=57343?(o+=4,e++):o+=3}else o+=3}return o}(r)>A)throw new ef("maxContentLength size of "+A+" exceeded",ef.ERR_BAD_RESPONSE,e,C);if(k&&"get"!==n&&"head"!==n){let t=await y(v,l);if("number"==typeof t&&isFinite(t)&&t>R)throw new ef("Request body larger than maxBodyLength limit",ef.ERR_BAD_REQUEST,e,C)}if(b&&d&&"get"!==n&&"head"!==n&&0!==(t=await y(v,l))){let e,n=new a(r,{method:"POST",body:l,duplex:"half"});if(Y.isFormData(l)&&(e=n.headers.get("content-type"))&&v.setContentType(e),n.body){let[e,r]=e$(t,ez(eH(b)));l=e2(n.body,65536,e,r)}}Y.isString(x)||(x=x?"include":"omit");let i=u&&"credentials"in a.prototype;if(Y.isFormData(l)){let e=v.getContentType();e&&/^multipart\/form-data/i.test(e)&&!/boundary=/i.test(e)&&v.delete("content-type")}v.set("User-Agent","axios/"+e5,!1);let c={...E,signal:P,method:n.toUpperCase(),headers:eo(v.normalize()),body:l,duplex:"half",credentials:i?x:void 0};C=u&&new a(r,c);let f=await (u?S(C,E):S(r,c));if(O){let t=Y.toFiniteNumber(f.headers.get("content-length"));if(null!=t&&t>A)throw new ef("maxContentLength size of "+A+" exceeded",ef.ERR_BAD_RESPONSE,e,C)}let p=h&&("stream"===w||"response"===w);if(h&&f.body&&(m||O||p&&T)){let t={};["status","statusText","headers"].forEach(e=>{t[e]=f[e]});let r=Y.toFiniteNumber(f.headers.get("content-length")),[n,o]=m&&e$(r,ez(eH(m),!0))||[];f=new s(e2(f.body,65536,t=>{if(O&&t>A)throw new ef("maxContentLength size of "+A+" exceeded",ef.ERR_BAD_RESPONSE,e,C);n&&n(t)},()=>{o&&o(),T&&T()}),t)}w=w||"text";let _=await g[Y.findKey(g,w)||"text"](f,e);if(O&&!h&&!p){let t;if(null!=_&&("number"==typeof _.byteLength?t=_.byteLength:"number"==typeof _.size?t=_.size:"string"==typeof _&&(t="function"==typeof o?new o().encode(_).byteLength:_.length)),"number"==typeof t&&t>A)throw new ef("maxContentLength size of "+A+" exceeded",ef.ERR_BAD_RESPONSE,e,C)}return!p&&T&&T(),await new Promise((t,r)=>{eI(t,r,{data:_,headers:eu.from(f.headers),status:f.status,statusText:f.statusText,config:e,request:C})})}catch(t){if(T&&T(),P&&P.aborted&&P.reason instanceof ef){let r=P.reason;throw r.config=e,C&&(r.request=C),t!==r&&(r.cause=t),r}if(t&&"TypeError"===t.name&&/Load failed|fetch/i.test(t.message))throw Object.assign(new ef("Network Error",ef.ERR_NETWORK,e,C,t&&t.response),{cause:t.cause||t});throw ef.from(t,t&&t.code,e,C,t&&t.response)}}},e4=new Map,e9=e=>{let t=e&&e.env||{},{fetch:r,Request:n,Response:o}=t,i=[n,o,r],a=i.length,s,l,u=e4;for(;a--;)s=i[a],void 0===(l=u.get(s))&&u.set(s,l=a?new Map:e3(t)),u=l;return l};e9();let e7={http:null,xhr:eY,fetch:{get:e9}};Y.forEach(e7,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{__proto__:null,value:t})}catch(e){}Object.defineProperty(e,"adapterName",{__proto__:null,value:t})}});let te=e=>`- ${e}`,tt=e=>Y.isFunction(e)||null===e||!1===e,tr=function(e,t){let r,n,{length:o}=e=Y.isArray(e)?e:[e],i={};for(let a=0;a<o;a++){let o;if(n=r=e[a],!tt(r)&&void 0===(n=e7[(o=String(r)).toLowerCase()]))throw new ef(`Unknown adapter '${o}'`);if(n&&(Y.isFunction(n)||(n=n.get(t))))break;i[o||"#"+a]=n}if(!n){let e=Object.entries(i).map(([e,t])=>`adapter ${e} `+(!1===t?"is not supported by the environment":"is not available in the build"));throw new ef("There is no suitable adapter to dispatch the request "+(o?e.length>1?"since :\n"+e.map(te).join("\n"):" "+te(e[0]):"as no adapter specified"),"ERR_NOT_SUPPORT")}return n};function tn(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new eF(null,e)}function to(e){return tn(e),e.headers=eu.from(e.headers),e.data=eL.call(e,e.transformRequest),-1!==["post","put","patch"].indexOf(e.method)&&e.headers.setContentType("application/x-www-form-urlencoded",!1),tr(e.adapter||eU.adapter,e)(e).then(function(t){tn(e),e.response=t;try{t.data=eL.call(e,e.transformResponse,t)}finally{delete e.response}return t.headers=eu.from(t.headers),t},function(t){if(!eD(t)&&(tn(e),t&&t.response)){e.response=t.response;try{t.response.data=eL.call(e,e.transformResponse,t.response)}finally{delete e.response}t.response.headers=eu.from(t.response.headers)}return Promise.reject(t)})}let ti={};["object","boolean","number","function","string","symbol"].forEach((e,t)=>{ti[e]=function(r){return typeof r===e||"a"+(t<1?"n ":" ")+e}});let ta={};ti.transitional=function(e,t,r){function n(e,t){return"[Axios v"+e5+"] Transitional option '"+e+"'"+t+(r?". "+r:"")}return(r,o,i)=>{if(!1===e)throw new ef(n(o," has been removed"+(t?" in "+t:"")),ef.ERR_DEPRECATED);return t&&!ta[o]&&(ta[o]=!0,console.warn(n(o," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(r,o,i)}},ti.spelling=function(e){return(t,r)=>(console.warn(`${r} is likely a misspelling of ${e}`),!0)};let ts=function(e,t,r){if("object"!=typeof e)throw new ef("options must be an object",ef.ERR_BAD_OPTION_VALUE);let n=Object.keys(e),o=n.length;for(;o-- >0;){let i=n[o],a=Object.prototype.hasOwnProperty.call(t,i)?t[i]:void 0;if(a){let t=e[i],r=void 0===t||a(t,i,e);if(!0!==r)throw new ef("option "+i+" must be "+r,ef.ERR_BAD_OPTION_VALUE);continue}if(!0!==r)throw new ef("Unknown option "+i,ef.ERR_BAD_OPTION)}};class tl{constructor(e){this.defaults=e||{},this.interceptors={request:new eE,response:new eE}}async request(e,t){try{return await this._request(e,t)}catch(e){if(e instanceof Error){let t={};Error.captureStackTrace?Error.captureStackTrace(t):t=Error();let r=(()=>{if(!t.stack)return"";let e=t.stack.indexOf("\n");return -1===e?"":t.stack.slice(e+1)})();try{if(e.stack){if(r){let t=r.indexOf("\n"),n=-1===t?-1:r.indexOf("\n",t+1),o=-1===n?"":r.slice(n+1);String(e.stack).endsWith(o)||(e.stack+="\n"+r)}}else e.stack=r}catch(e){}}throw e}}_request(e,t){let r,n;"string"==typeof e?(t=t||{}).url=e:t=e||{};let{transitional:o,paramsSerializer:i,headers:a}=t=eK(this.defaults,t);void 0!==o&&ts(o,{silentJSONParsing:ti.transitional(ti.boolean),forcedJSONParsing:ti.transitional(ti.boolean),clarifyTimeoutError:ti.transitional(ti.boolean),legacyInterceptorReqResOrdering:ti.transitional(ti.boolean)},!1),null!=i&&(Y.isFunction(i)?t.paramsSerializer={serialize:i}:ts(i,{encode:ti.function,serialize:ti.function},!0)),void 0!==t.allowAbsoluteUrls||(void 0!==this.defaults.allowAbsoluteUrls?t.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:t.allowAbsoluteUrls=!0),ts(t,{baseUrl:ti.spelling("baseURL"),withXsrfToken:ti.spelling("withXSRFToken")},!0),t.method=(t.method||this.defaults.method||"get").toLowerCase();let s=a&&Y.merge(a.common,a[t.method]);a&&Y.forEach(["delete","get","head","post","put","patch","query","common"],e=>{delete a[e]}),t.headers=eu.concat(s,a);let l=[],u=!0;this.interceptors.request.forEach(function(e){if("function"==typeof e.runWhen&&!1===e.runWhen(t))return;u=u&&e.synchronous;let r=t.transitional||eA;r&&r.legacyInterceptorReqResOrdering?l.unshift(e.fulfilled,e.rejected):l.push(e.fulfilled,e.rejected)});let c=[];this.interceptors.response.forEach(function(e){c.push(e.fulfilled,e.rejected)});let f=0;if(!u){let e=[to.bind(this),void 0];for(e.unshift(...l),e.push(...c),n=e.length,r=Promise.resolve(t);f<n;)r=r.then(e[f++],e[f++]);return r}n=l.length;let p=t;for(;f<n;){let e=l[f++],t=l[f++];try{p=e(p)}catch(e){t.call(this,e);break}}try{r=to.call(this,p)}catch(e){return Promise.reject(e)}for(f=0,n=c.length;f<n;)r=r.then(c[f++],c[f++]);return r}getUri(e){return ex(eJ((e=eK(this.defaults,e)).baseURL,e.url,e.allowAbsoluteUrls),e.params,e.paramsSerializer)}}Y.forEach(["delete","get","head","options"],function(e){tl.prototype[e]=function(t,r){return this.request(eK(r||{},{method:e,url:t,data:(r||{}).data}))}}),Y.forEach(["post","put","patch","query"],function(e){function t(t){return function(r,n,o){return this.request(eK(o||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:r,data:n}))}}tl.prototype[e]=t(),"query"!==e&&(tl.prototype[e+"Form"]=t(!0))});class tu{constructor(e){let t;if("function"!=typeof e)throw TypeError("executor must be a function.");this.promise=new Promise(function(e){t=e});const r=this;this.promise.then(e=>{if(!r._listeners)return;let t=r._listeners.length;for(;t-- >0;)r._listeners[t](e);r._listeners=null}),this.promise.then=e=>{let t,n=new Promise(e=>{r.subscribe(e),t=e}).then(e);return n.cancel=function(){r.unsubscribe(t)},n},e(function(e,n,o){r.reason||(r.reason=new eF(e,n,o),t(r.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;let t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}toAbortSignal(){let e=new AbortController,t=t=>{e.abort(t)};return this.subscribe(t),e.signal.unsubscribe=()=>this.unsubscribe(t),e.signal}static source(){let e;return{token:new tu(function(t){e=t}),cancel:e}}}let tc={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(tc).forEach(([e,t])=>{tc[t]=e});let tf=function e(t){let r=new tl(t),n=p(tl.prototype.request,r);return Y.extend(n,tl.prototype,r,{allOwnKeys:!0}),Y.extend(n,r,null,{allOwnKeys:!0}),n.create=function(r){return e(eK(t,r))},n}(eU);tf.Axios=tl,tf.CanceledError=eF,tf.CancelToken=tu,tf.isCancel=eD,tf.VERSION=e5,tf.toFormData=em,tf.AxiosError=ef,tf.Cancel=tf.CanceledError,tf.all=function(e){return Promise.all(e)},tf.spread=function(e){return function(t){return e.apply(null,t)}},tf.isAxiosError=function(e){return Y.isObject(e)&&!0===e.isAxiosError},tf.mergeConfig=eK,tf.AxiosHeaders=eu,tf.formToJSON=e=>eB(Y.isHTMLForm(e)?new FormData(e):e),tf.getAdapter=tr,tf.HttpStatusCode=tc,tf.default=tf;let tp=f.default.env.NEXT_PUBLIC_API_URL||"http://localhost:8000/api",td=tf.create({baseURL:tp,timeout:2200}),th=[{id:"documind-overview",filename:"DocuMind_Product_Guide.pdf",title:"DocuMind RAG Guide",tag:"AI Architecture · 5 Pages",pagesCount:5,mode:"browser",quickQuestions:["Which AI models are used under the hood?","How does it avoid making up fake answers?","How fast is the search and response time?"],pages:[{page:1,title:"Overview & Core Purpose",summaryAnswer:"DocuMind reads your uploaded PDF page-by-page and answers questions using only the actual text inside your document, attaching exact page numbers to every answer.",excerpt:"DocuMind is a Retrieval-Augmented Generation (RAG) workspace built with Python FastAPI and Next.js. Every answer is linked directly to the page where the information was found.",keywords:["overview","what","documind","purpose","work","pdf","answer","questions"]},{page:2,title:"PDF Reading & Smart Chunking",summaryAnswer:"When you upload a PDF, PyMuPDF extracts text from each page and splits it into 500-character passages with a 50-character overlap so sentences are never cut off mid-thought.",excerpt:"Uploaded files are parsed via PyMuPDF (fitz) to preserve 1-indexed page numbers, then segmented with LangChain's RecursiveCharacterTextSplitter (500 chars, 50-char overlap).",keywords:["upload","chunk","chunking","split","pymupdf","read","parse","ingest","pdf"]},{page:3,title:"Local Vector Search (ChromaDB)",summaryAnswer:"Each passage is converted into a 384-dimensional vector using HuggingFace's all-MiniLM-L6-v2 model locally and stored in ChromaDB for instant semantic search without extra API costs.",excerpt:"Text passages are encoded locally using sentence-transformers (all-MiniLM-L6-v2) into 384-d embeddings and indexed in per-document ChromaDB collections.",keywords:["model","models","embedding","vector","chromadb","minilm","huggingface","database","under","hood"]},{page:4,title:"Zero-Hallucination Grounding",summaryAnswer:"To prevent fake or guessed answers, Groq Llama 3.1 runs at temperature 0.0 and is strictly instructed to answer only from the top-4 retrieved passages—or politely say if the topic isn't in the PDF.",excerpt:"At query time, the top-4 matching passages are passed to Groq (llama-3.1-8b-instant, temperature = 0). Strict system instructions forbid answering outside the retrieved text.",keywords:["hallucination","fake","accurate","grounding","groq","llama","avoid","prevent","truth","temperature"]},{page:5,title:"Speed & API Performance",summaryAnswer:"Combining local MiniLM embeddings with Groq LPU inference delivers answers in roughly 350–450 milliseconds end-to-end.",excerpt:"Local vector lookup in ChromaDB completes in ~25 ms and Groq Llama 3.1 synthesis finishes in ~350 ms, delivering sub-second responses across 40+ page documents.",keywords:["fast","speed","latency","time","performance","api","seconds","ms"]}]},{id:"crickconnect-guide",filename:"CrickConnect_Scouting_Report.pdf",title:"CrickConnect Scouting",tag:"Sports AI · 4 Pages",pagesCount:4,mode:"browser",quickQuestions:["How are cricket players ranked in the app?","How does the AI analyze bowling and batting video?","How does the app stop fake stats?"],pages:[{page:1,title:"Mobile Scouting Platform",summaryAnswer:"CrickConnect is a React Native mobile platform that helps scouts discover grassroots cricket talent across Pakistan using objective AI video analysis and verified match records.",excerpt:"Built with React Native (Expo), TypeScript, FastAPI, and Supabase, CrickConnect replaces subjective trial selection with transparent regional and national leaderboards.",keywords:["crickconnect","what","platform","app","mobile","scout","cricket"]},{page:2,title:"MediaPipe 33-Joint Video Analysis",summaryAnswer:"Google MediaPipe tracks 33 body joints from practice videos to measure batting backlift angle, bowling arm release angle, and follow-through balance.",excerpt:"The FastAPI backend processes video frames with Google MediaPipe Pose, extracting 33 3D skeletal keypoints to score biomechanical form against coaching benchmarks.",keywords:["video","ai","analyze","mediapipe","bowling","batting","joints","pose","camera"]},{page:3,title:"60/40 Smart Ranking Formula",summaryAnswer:"Every player's score combines 60% AI biomechanical video evaluation with 40% verified match statistics, automatically awarding Gold, Silver, or Bronze badges via PostgreSQL triggers.",excerpt:"Supabase PostgreSQL triggers compute a weighted composite score (60% AI biomechanics + 40% match stats) and assign Gold (85+), Silver (70–84), or Bronze (50–69) tiers.",keywords:["rank","ranked","ranking","score","formula","badge","gold","silver","60","40"]},{page:4,title:"Anti-Cheat Profile Locking",summaryAnswer:"Biomechanical scores are locked at the database level so players cannot manually edit their AI ratings, keeping leaderboards tamper-proof for coaches.",excerpt:"Row-Level Security (RLS) policies in Supabase lock AI metric columns to read-only for clients, allowing updates only from the verified FastAPI evaluation worker.",keywords:["fake","cheat","anti-cheat","security","stop","lock","stats","tamper"]}]},{id:"lacey-guide",filename:"Lacey_Storefront_Overview.pdf",title:"Lacey Storefront",tag:"E-Commerce · 3 Pages",pagesCount:3,mode:"browser",quickQuestions:["How does browser background removal work?","How does the cart handle one-of-one thrifted shoes?","How is the storefront tested?"],pages:[{page:1,title:"One-of-One Thrifted Inventory",summaryAnswer:"Because every pre-owned pair is unique (quantity = 1), Lacey tracks real-time Available, Reserved, and Sold states along with an honest per-pair condition grade.",excerpt:"Built with Next.js 16 and React 19, Lacey manages single-pair inventory with transparent wear grading (Like New, Gently Used, Vintage) and instant Cmd+K search.",keywords:["cart","inventory","one","thrifted","shoes","condition","storefront","lacey"]},{page:2,title:"In-Browser ONNX Background Removal",summaryAnswer:"When admins upload shoe photos, an ONNX AI model runs directly inside the web browser to cut out the background automatically—costing $0 in server GPUs.",excerpt:"The /admin dashboard executes @imgly/background-removal via ONNX Runtime Web (WASM/WebGL) in the browser before storing clean cutouts in Vercel Blob.",keywords:["background","removal","onnx","photo","image","admin","ai","browser","gpu"]},{page:3,title:"Automated Playwright E2E Testing",summaryAnswer:"A Playwright end-to-end test suite automatically checks collection filters, product condition pages, and checkout flows on every code change.",excerpt:"Playwright tests verify catalog search, one-of-one cart reservation locks, and mobile checkout responsiveness across desktop and mobile viewports.",keywords:["test","tested","testing","playwright","quality","e2e"]}]}],tg=new Map(th.map(e=>[e.id,e]));function tm(){return Array.from(tg.values())}function ty(e,t){let r=(new TextDecoder("latin1").decode(t).match(/\(([^()\\]{4,240})\)/g)||[]).map(e=>e.slice(1,-1).replace(/[^\x20-\x7E]/g," ").replace(/\s+/g," ").trim()).filter(e=>e.length>=5&&/[A-Za-z]{3,}/.test(e));if(r.length>=6){let e=r.join(" "),t=[],n=1;for(let r=0;r<e.length&&n<=6;r+=380){let o=e.slice(r,r+380);t.push({page:n,title:`Page ${n} Content`,summaryAnswer:o,excerpt:o,keywords:o.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(e=>e.length>3)}),n++}return t}let n=Math.max(1,Math.round(t.byteLength/1024));return[{page:1,title:`${e} (${n} KB)`,summaryAnswer:`Uploaded "${e}" (${n} KB). In live static preview mode, compressed PDF streams are indexed by filename; connect the local FastAPI PyMuPDF server (port 8000) for full binary decompression.`,excerpt:`File: ${e} \xb7 Size: ${n} KB \xb7 Ready for inspection.`,keywords:["summary","overview","file","pdf","page","document"]}]}async function tb(e){let t=new FormData;t.append("file",e);try{let r=(await td.post("/upload",t,{headers:{"Content-Type":"multipart/form-data"}})).data,n=await e.arrayBuffer(),o=ty(e.name,new Uint8Array(n)),i={id:r.document_id,filename:e.name,title:e.name.replace(/\.pdf$/i,""),tag:`Uploaded PDF \xb7 ${r.pages_processed||o.length} Pages`,pagesCount:r.pages_processed||o.length,pages:o,quickQuestions:["Summarize the main points of this PDF.","What is covered on Page 1?"],mode:"fastapi"};return tg.set(i.id,i),i}catch{let t=await e.arrayBuffer(),r=ty(e.name,new Uint8Array(t)),n={id:`custom-${Date.now()}`,filename:e.name,title:e.name.replace(/\.pdf$/i,"").replace(/[-_]/g," "),tag:`Uploaded \xb7 ${r.length} Page${r.length>1?"s":""}`,pagesCount:r.length,pages:r,quickQuestions:["What is on Page 1 of this document?","Give me a quick summary of this file."],mode:"browser"};return tg.set(n.id,n),n}}async function tw(e,t){let r=tg.get(e)||th[0];if("fastapi"===r.mode)try{let n=await td.post("/query",{document_id:e,query:t}),o=n.data.sources||[1];return{answer:n.data.answer,sources:o,matchedPages:r.pages.filter(e=>o.includes(e.page))}}catch{}await new Promise(e=>setTimeout(e,220));let n=t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(e=>e.length>2),o=r.pages.map(e=>{let t=`${e.title} ${e.summaryAnswer} ${e.excerpt} ${e.keywords.join(" ")}`.toLowerCase(),r=0;for(let o of n)e.keywords.includes(o)?r+=4:t.includes(o)&&(r+=2);return{page:e,score:r}}).sort((e,t)=>t.score-e.score).filter(e=>e.score>0).slice(0,2);if(0===o.length){let e=r.pages[0];return{answer:`${e.summaryAnswer} [Page ${e.page}]`,sources:[e.page],matchedPages:[e]}}let i=o.map(e=>e.page),a=i.map(e=>e.page);return{answer:i.map(e=>`${e.summaryAnswer} [Page ${e.page}]`).join(" "),sources:a,matchedPages:i}}let tv={id:"d1",question:"How does DocuMind answer questions from a PDF?",answer:"When you upload a PDF, PyMuPDF extracts text from each page and splits it into 500-character passages with a 50-character overlap so sentences are never cut off mid-thought. [Page 2] Each passage is converted into a 384-dimensional vector using HuggingFace's all-MiniLM-L6-v2 model locally and stored in ChromaDB for instant semantic search without extra API costs. [Page 3]",sources:[2,3]},tx={id:"d2",question:"How are cricket players ranked in the app?",answer:"Every player's score combines 60% AI biomechanical video evaluation with 40% verified match statistics, automatically awarding Gold, Silver, or Bronze badges via PostgreSQL triggers. [Page 3] Biomechanical scores are locked at the database level so players cannot manually edit their AI ratings, keeping leaderboards tamper-proof for coaches. [Page 4]",sources:[3,4]},tE={id:"d3",question:"How does browser background removal work?",answer:"When admins upload shoe photos, an ONNX AI model runs directly inside the web browser to cut out the background automatically—costing $0 in server GPUs. [Page 2]",sources:[2]},tA=`
.ap-page {
  min-height: 100dvh;
  background: var(--bg-page);
  color: var(--ink-primary);
  display: flex;
  flex-direction: column;
}

/* ── Slim Apple Frosted Top Nav ── */
.ap-nav {
  height: 52px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--hairline);
  position: sticky;
  top: 0;
  z-index: 20;
}

.ap-nav-inner {
  max-width: 860px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ap-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
}

.ap-logo-badge {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--lead-teal-dark);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ap-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ap-upload-pill {
  appearance: none;
  border: none;
  background: var(--spark-coral);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  padding: 7px 15px;
  border-radius: 9999px;
  cursor: pointer;
  transition: transform 120ms ease, opacity 150ms ease;
}

.ap-upload-pill:hover {
  opacity: 0.92;
}

.ap-upload-pill:active {
  transform: scale(0.96);
}

.ap-gh-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-secondary);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 9999px;
  transition: color 150ms ease, background 150ms ease;
}

.ap-gh-link:hover {
  color: var(--ink-primary);
  background: rgba(0, 0, 0, 0.04);
}

/* ── Centered Single-Column Stage ── */
.ap-stage {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 26px 20px 44px;
  flex: 1;
}

/* ── Hero Headline ── */
.ap-hero {
  text-align: center;
  margin-bottom: 18px;
}

.ap-hero-title {
  font-size: clamp(26px, 3.6vw, 36px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--ink-primary);
  margin-bottom: 6px;
}

.ap-hero-sub {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: -0.01em;
  color: var(--ink-secondary);
}

/* ── Document Switcher Pills ── */
.ap-doc-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
}

.ap-doc-pill {
  appearance: none;
  border: 1px solid var(--hairline);
  background: var(--bg-card);
  color: var(--ink-secondary);
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 500;
  padding: 9px 16px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 150ms ease;
}

.ap-doc-pill:hover {
  color: var(--ink-primary);
  border-color: rgba(0, 0, 0, 0.18);
}

.ap-doc-pill.active {
  background: var(--lead-teal-dark);
  color: #ffffff;
  border-color: var(--lead-teal-dark);
}

.ap-doc-pill-count {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.06);
}

.ap-doc-pill.active .ap-doc-pill-count {
  background: rgba(255, 255, 255, 0.16);
  color: #e6f4f1;
}

/* ── Main Apple 18px Card ── */
.ap-card {
  background: var(--bg-card);
  border-radius: 18px;
  border: 1px solid var(--hairline);
  overflow: hidden;
}

/* ── Deep Teal Document Banner ("One Field, One Spark") ── */
.ap-banner {
  background: var(--lead-teal-dark);
  color: #ffffff;
  padding: 22px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.ap-banner-label {
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8ce0ce;
  margin-bottom: 3px;
}

.ap-banner-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.ap-page-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ap-page-dot {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 140ms ease;
}

.ap-page-dot:hover {
  background: rgba(255, 255, 255, 0.18);
}

.ap-page-dot.active {
  background: var(--spark-coral);
  border-color: var(--spark-coral);
  color: #ffffff;
}

/* ── Clean Answer Area ── */
.ap-body {
  padding: 28px;
}

.ap-turn {
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--hairline);
}

.ap-turn:last-of-type {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.ap-question {
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
  margin-bottom: 10px;
}

.ap-answer {
  font-size: 16.5px;
  font-weight: 400;
  line-height: 1.58;
  letter-spacing: -0.01em;
  color: #2c2c2e;
}

.ap-cite-badge {
  appearance: none;
  border: none;
  background: var(--spark-coral-soft);
  color: var(--spark-coral);
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 9999px;
  margin: 0 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: background 140ms ease, transform 100ms ease;
}

.ap-cite-badge:hover {
  background: #ffe0d9;
}

.ap-cite-badge:active {
  transform: scale(0.95);
}

/* ── Clean Source Page Drawer (Only 1 focused page shown!) ── */
.ap-source-drawer {
  margin-top: 22px;
  background: var(--lead-teal-soft);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-source-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ap-source-badge {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--lead-teal);
}

.ap-source-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--lead-teal-dark);
}

.ap-source-excerpt {
  font-size: 14.5px;
  line-height: 1.55;
  color: #1f3a34;
}

/* ── Bottom Ask Area ── */
.ap-ask-zone {
  padding: 20px 28px 26px;
  background: #fafafc;
  border-top: 1px solid var(--hairline);
}

.ap-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 14px;
}

.ap-suggestion-chip {
  appearance: none;
  border: 1px solid var(--hairline);
  background: var(--bg-card);
  color: var(--ink-secondary);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 140ms ease;
}

.ap-suggestion-chip:hover {
  color: var(--lead-teal-dark);
  border-color: var(--lead-teal);
  background: var(--lead-teal-soft);
}

.ap-input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 9999px;
  padding: 6px 6px 6px 20px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.ap-input-bar:focus-within {
  border-color: var(--lead-teal);
  box-shadow: 0 0 0 3px rgba(17, 94, 80, 0.12);
}

.ap-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 15.5px;
  color: var(--ink-primary);
  min-width: 0;
}

.ap-input::placeholder {
  color: var(--ink-tertiary);
}

.ap-ask-btn {
  appearance: none;
  border: none;
  background: var(--lead-teal-dark);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  padding: 11px 22px;
  border-radius: 9999px;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 120ms ease, background 150ms ease;
}

.ap-ask-btn:hover:not(:disabled) {
  background: var(--lead-teal);
}

.ap-ask-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.ap-ask-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .ap-stage {
    padding: 24px 14px 44px;
  }
  .ap-banner,
  .ap-body,
  .ap-ask-zone {
    padding: 18px;
  }
  .ap-question {
    font-size: 17px;
  }
  .ap-answer {
    font-size: 15px;
  }
}
`;e.s(["default",0,function(){let[e,t]=(0,c.useState)(()=>tm()),[r,n]=(0,c.useState)(th[0].id),[o,i]=(0,c.useState)({"documind-overview":[tv],"crickconnect-guide":[tx],"lacey-guide":[tE]}),[a,s]=(0,c.useState)(2),[l,f]=(0,c.useState)(""),[p,d]=(0,c.useState)(!1),[h,g]=(0,c.useState)(!1),m=(0,c.useRef)(null),y=e.find(e=>e.id===r)||th[0],b=o[y.id]||[],w=y.pages.find(e=>e.page===a)||y.pages[0],v=async e=>{let t=("string"==typeof e?e:l).trim();if(t&&!p){"string"!=typeof e&&f(""),d(!0);try{let e=await tw(y.id,t),r={id:`t-${Date.now()}`,question:t,answer:e.answer,sources:e.sources};i(e=>({...e,[y.id]:[r]})),e.sources[0]&&s(e.sources[0])}finally{d(!1)}}},x=async e=>{let r=e.target.files?.[0];if(r){g(!0);try{let e=await tb(r);t(tm()),n(e.id),s(1),i(t=>({...t,[e.id]:[{id:`u-${Date.now()}`,question:`Summary of ${e.filename}`,answer:`${e.pages[0].summaryAnswer} [Page 1]`,sources:[1]}]}))}finally{g(!1),e.target.value=""}}};return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("style",{children:tA}),(0,u.jsxs)("div",{className:"ap-page",children:[(0,u.jsx)("header",{className:"ap-nav",children:(0,u.jsxs)("div",{className:"ap-nav-inner",children:[(0,u.jsxs)("div",{className:"ap-logo",children:[(0,u.jsx)("span",{className:"ap-logo-badge",children:"D"}),(0,u.jsx)("span",{children:"DocuMind"})]}),(0,u.jsxs)("div",{className:"ap-nav-actions",children:[(0,u.jsx)("input",{ref:m,type:"file",accept:"application/pdf,.pdf",onChange:x,style:{display:"none"}}),(0,u.jsx)("button",{type:"button",className:"ap-upload-pill",onClick:()=>m.current?.click(),children:h?"Reading PDF…":"+ Upload PDF"}),(0,u.jsx)("a",{href:"https://github.com/jibran-jpeg/documind",target:"_blank",rel:"noopener noreferrer",className:"ap-gh-link",children:"GitHub ↗"})]})]})}),(0,u.jsxs)("main",{className:"ap-stage",children:[(0,u.jsxs)("div",{className:"ap-hero",children:[(0,u.jsx)("h1",{className:"ap-hero-title",children:"Ask your PDF anything."}),(0,u.jsx)("p",{className:"ap-hero-sub",children:"Clear answers grounded in your document, with clickable page numbers."})]}),(0,u.jsx)("div",{className:"ap-doc-bar",role:"tablist","aria-label":"Sample PDFs",children:e.map(e=>{let t=e.id===y.id;return(0,u.jsxs)("button",{type:"button",role:"tab","aria-selected":t,className:`ap-doc-pill ${t?"active":""}`,onClick:()=>{let t;return n(e.id),t=o[e.id]||[],void s(t[t.length-1]?.sources?.[0]||1)},children:[(0,u.jsx)("span",{children:e.title}),(0,u.jsxs)("span",{className:"ap-doc-pill-count",children:[e.pagesCount,"p"]})]},e.id)})}),(0,u.jsxs)("section",{className:"ap-card",children:[(0,u.jsxs)("div",{className:"ap-banner",children:[(0,u.jsxs)("div",{children:[(0,u.jsx)("div",{className:"ap-banner-label",children:y.tag}),(0,u.jsx)("div",{className:"ap-banner-title",children:y.filename})]}),(0,u.jsx)("div",{className:"ap-page-dots","aria-label":"Inspect page",children:y.pages.map(e=>(0,u.jsxs)("button",{type:"button",className:`ap-page-dot ${a===e.page?"active":""}`,onClick:()=>s(e.page),children:["Page ",e.page]},e.page))})]}),(0,u.jsxs)("div",{className:"ap-body",children:[b.map(e=>(0,u.jsxs)("div",{className:"ap-turn",children:[(0,u.jsx)("h2",{className:"ap-question",children:e.question}),(0,u.jsx)("p",{className:"ap-answer",children:e.answer.split(/(\[Page\s+\d+\])/g).map((e,t)=>{let r=e.match(/^\[Page\s+(\d+)\]$/);if(r){let e=parseInt(r[1],10);return(0,u.jsxs)("button",{type:"button",className:"ap-cite-badge",onClick:()=>s(e),title:`Show Page ${e} source`,children:["Page ",e]},t)}return(0,u.jsx)(c.default.Fragment,{children:e},t)})})]},e.id)),w&&(0,u.jsxs)("div",{className:"ap-source-drawer",children:[(0,u.jsx)("div",{className:"ap-source-top",children:(0,u.jsxs)("span",{className:"ap-source-badge",children:["Verified Source · Page ",w.page," of"," ",y.pagesCount]})}),(0,u.jsx)("div",{className:"ap-source-title",children:w.title}),(0,u.jsxs)("div",{className:"ap-source-excerpt",children:["“",w.excerpt,"”"]})]})]}),(0,u.jsxs)("div",{className:"ap-ask-zone",children:[(0,u.jsx)("div",{className:"ap-suggestions",children:y.quickQuestions.map(e=>(0,u.jsx)("button",{type:"button",className:"ap-suggestion-chip",onClick:()=>v(e),children:e},e))}),(0,u.jsxs)("form",{className:"ap-input-bar",onSubmit:e=>{e.preventDefault(),v()},children:[(0,u.jsx)("input",{type:"text",className:"ap-input",placeholder:`Ask a question about ${y.title}…`,value:l,onChange:e=>f(e.target.value),disabled:p}),(0,u.jsx)("button",{type:"submit",className:"ap-ask-btn",disabled:!l.trim()||p,children:p?"Checking…":"Ask PDF"})]})]})]})]})]})]})}],28255)}]);