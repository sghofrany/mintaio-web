!function(e,t,n,s,i){var r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o="function"==typeof r.parcelRequiref2b0&&r.parcelRequiref2b0,l=o.cache||{},c="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function a(t,n){if(!l[t]){if(!e[t]){var s="function"==typeof r.parcelRequiref2b0&&r.parcelRequiref2b0;if(!n&&s)return s(t,!0);if(o)return o(t,!0);if(c&&"string"==typeof t)return c(t);var i=new Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}u.resolve=function(n){var s=e[t][1][n];return null!=s?s:n},u.cache={};var h=l[t]=new a.Module(t);e[t][0].call(h.exports,u,h,h.exports,this)}return l[t].exports;function u(e){var t=u.resolve(e);return!1===t?{}:a(t)}}a.isParcelRequire=!0,a.Module=function(e){this.id=e,this.bundle=a,this.exports={}},a.modules=e,a.cache=l,a.parent=o,a.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(a,"root",{get:function(){return r.parcelRequiref2b0}}),r.parcelRequiref2b0=a;for(var h=0;h<t.length;h++)a(t[h])}({dRfB2:[function(e,t,n){var s=e("@parcel/transformer-js/src/esmodule-helpers.js");s.defineInteropFlag(n),s.export(n,"AlchemyWebSocketProvider",(()=>k)),s.export(n,"getAlchemyEventTag",(()=>T));var i=e("./index-dddbb41a.js"),r=e("@ethersproject/bignumber"),o=e("./alchemy-provider-1b13a2c9.js"),l=e("sturdy-websocket"),c=s.interopDefault(l),a=e("@ethersproject/providers"),h=e("@ethersproject/networks"),u=(e("axios"),e("@ethersproject/wallet"),e("@ethersproject/web"),e("process"));class d{constructor(e){this.provider=e,this.maxBackfillBlocks=120}getNewHeadsBackfill(e,t,n){return(0,i._)(this,void 0,void 0,(function*(){m(e);const s=yield this.getBlockNumber();if(m(e),0===t.length)return this.getHeadEventsInRange(Math.max(n,s-this.maxBackfillBlocks)+1,s+1);const r=(0,i.f)(t[t.length-1].number),o=s-this.maxBackfillBlocks+1;if(r<=o)return this.getHeadEventsInRange(o,s+1);const l=yield this.getReorgHeads(e,t);m(e);const c=yield this.getHeadEventsInRange(r+1,s+1);return m(e),[...l,...c]}))}getLogsBackfill(e,t,n,s){return(0,i._)(this,void 0,void 0,(function*(){m(e);const r=yield this.getBlockNumber();if(m(e),0===n.length)return this.getLogsInRange(t,Math.max(s,r-this.maxBackfillBlocks)+1,r+1);const o=(0,i.f)(n[n.length-1].blockNumber),l=r-this.maxBackfillBlocks+1;if(o<l)return this.getLogsInRange(t,l,r+1);const c=yield this.getCommonAncestor(e,n);m(e);const a=n.filter((e=>(0,i.f)(e.blockNumber)>c.blockNumber)).map((e=>Object.assign(Object.assign({},e),{removed:!0}))),h=c.blockNumber===Number.NEGATIVE_INFINITY?(0,i.f)(n[0].blockNumber):c.blockNumber;let u=yield this.getLogsInRange(t,h,r+1);return u=u.filter((e=>e&&((0,i.f)(e.blockNumber)>c.blockNumber||(0,i.f)(e.logIndex)>c.logIndex))),m(e),[...a,...u]}))}setMaxBackfillBlock(e){this.maxBackfillBlocks=e}getBlockNumber(){return(0,i._)(this,void 0,void 0,(function*(){const e=yield this.provider.send("eth_blockNumber");return(0,i.f)(e)}))}getHeadEventsInRange(e,t){return(0,i._)(this,void 0,void 0,(function*(){if(e>=t)return[];const n=[];for(let s=e;s<t;s++)n.push({method:"eth_getBlockByNumber",params:[(0,i.t)(s),!1]});return(yield this.provider.sendBatch(n)).reduce(((e,t)=>e.concat(t)),[]).map(f)}))}getReorgHeads(e,t){return(0,i._)(this,void 0,void 0,(function*(){const n=[];for(let s=t.length-1;s>=0;s--){const r=t[s],o=yield this.getBlockByNumber((0,i.f)(r.number));if(m(e),r.hash===o.hash)break;n.push(f(o))}return n.reverse()}))}getBlockByNumber(e){return(0,i._)(this,void 0,void 0,(function*(){return this.provider.send("eth_getBlockByNumber",[(0,i.t)(e),!1])}))}getCommonAncestor(e,t){return(0,i._)(this,void 0,void 0,(function*(){let n=yield this.getBlockByNumber((0,i.f)(t[t.length-1].blockNumber));m(e);for(let e=t.length-1;e>=0;e--){const s=t[e];if(s.blockNumber!==n.number&&(n=yield this.getBlockByNumber((0,i.f)(s.blockNumber))),s.blockHash===n.hash)return{blockNumber:(0,i.f)(s.blockNumber),logIndex:(0,i.f)(s.logIndex)}}return{blockNumber:Number.NEGATIVE_INFINITY,logIndex:Number.NEGATIVE_INFINITY}}))}getLogsInRange(e,t,n){return(0,i._)(this,void 0,void 0,(function*(){if(t>=n)return[];const s=Object.assign(Object.assign({},e),{fromBlock:(0,i.t)(t),toBlock:(0,i.t)(n-1)});return this.provider.send("eth_getLogs",[s])}))}}function f(e){const t=Object.assign({},e);return delete t.totalDifficulty,delete t.transactions,delete t.uncles,t}function p(e,t){const n=new Set,s=[];return e.forEach((e=>{const i=t(e);n.has(i)||(n.add(i),s.push(e))})),s}const b=new Error("Cancelled");function m(e){if(e())throw b}const g="alchemy-pending-transactions";class v extends class{constructor(e,t,n){this.listener=t,this.tag=e,this.once=n,this._lastBlockNumber=-2,this._inflight=!1}get event(){switch(this.type){case"tx":return this.hash;case"filter":return this.filter;default:return this.tag}}get type(){return this.tag.split(":")[0]}get hash(){const e=this.tag.split(":");if("tx"!==e[0])throw new Error("Not a transaction event");return e[1]}get filter(){const e=this.tag.split(":");if("filter"!==e[0])throw new Error("Not a transaction event");const t=e[1],n=""===(s=e[2])?[]:s.split(/&/g).map((e=>{if(""===e)return[];const t=e.split("|").map((e=>"null"===e?null:e));return 1===t.length?t[0]:t}));var s;const i={};return n.length>0&&(i.topics=n),t&&"*"!==t&&(i.address=t),i}pollable(){return this.tag.indexOf(":")>=0||["block","network","pending","poll"].indexOf(this.tag)>=0}}{get fromAddress(){const e=this.tag.split(":");if(e[0]===g)return e[1]&&"*"!==e[1]?y(e[1]):void 0}get toAddress(){const e=this.tag.split(":");if(e[0]===g)return e[2]&&"*"!==e[2]?y(e[2]):void 0}get hashesOnly(){const e=this.tag.split(":");if(e[0]===g)return e[3]&&"*"!==e[3]?"true"===e[3]:void 0}}function y(e){if(""===e)return;const t=e.split("|");return 1===t.length?t[0]:t}class k extends a.WebSocketProvider{constructor(t,n){var s;const r=o.AlchemyProvider.getApiKey(t.apiKey),l=o.AlchemyProvider.getAlchemyNetwork(t.network),a=o.AlchemyProvider.getAlchemyConnectionInfo(l,r,"wss"),h=`alchemy-sdk-${i.V}`;super(new(0,c.default)(null!==(s=t.url)&&void 0!==s?s:a.url,h,{wsConstructor:null!=n?n:void 0!==u&&null!=u&&null!=u.versions&&null!=u.versions.node?e("websocket").w3cwebsocket:WebSocket}),i.E[l]),this._events=[],this.virtualSubscriptionsById=new Map,this.virtualIdsByPhysicalId=new Map,this.handleMessage=e=>{const t=JSON.parse(e.data);if(!function(e){return!function(e){return Array.isArray(e)||"2.0"===e.jsonrpc&&void 0!==e.id}(e)}(t))return;const n=t.params.subscription,s=this.virtualIdsByPhysicalId.get(n);if(!s)return;const i=this.virtualSubscriptionsById.get(s);if("eth_subscribe"===i.method)switch(i.params[0]){case"newHeads":{const e=i,r=t,{isBackfilling:o,backfillBuffer:l}=e,{result:c}=r.params;o?function(e,t){B(e,t,I)}(l,c):n!==s?this.emitAndRememberEvent(s,c,I):this.rememberEvent(s,c,I);break}case"logs":{const e=i,r=t,{isBackfilling:o,backfillBuffer:l}=e,{result:c}=r.params;o?function(e,t){B(e,t,N)}(l,c):s!==n?this.emitAndRememberEvent(s,c,N):this.rememberEvent(s,c,N);break}}},this.handleReopen=()=>{this.virtualIdsByPhysicalId.clear();const{cancel:e,isCancelled:t}=function(){let e=!1;return{cancel:()=>e=!0,isCancelled:()=>e}}();this.cancelBackfill=e;for(const e of this.virtualSubscriptionsById.values())(()=>{(0,i._)(this,void 0,void 0,(function*(){try{yield this.resubscribeAndBackfill(t,e)}catch(n){t()||console.error(`Error while backfilling "${e.params[0]}" subscription. Some events may be missing.`,n)}}))})();this.startHeartbeat()},this.stopHeartbeatAndBackfill=()=>{null!=this.heartbeatIntervalId&&(clearInterval(this.heartbeatIntervalId),this.heartbeatIntervalId=void 0),this.cancelBackfill()},this.apiKey=r,this.backfiller=new d(this),this.addSocketListeners(),this.startHeartbeat(),this.cancelBackfill=i.n}static getNetwork(e){return"string"==typeof e&&e in i.C?i.C[e]:(0,h.getNetwork)(e)}on(e,t){return this._addEventListener(e,t,!1)}once(e,t){return this._addEventListener(e,t,!0)}off(e,t){return C(e)?this._off(e,t):super.off(e,t)}removeAllListeners(e){return void 0!==e&&C(e)?this._removeAllListeners(e):super.removeAllListeners(e)}listenerCount(e){return void 0!==e&&C(e)?this._listenerCount(e):super.listenerCount(e)}listeners(e){return void 0!==e&&C(e)?this._listeners(e):super.listeners(e)}_addEventListener(e,t,n){if(C(e)){const s=new v(T(e),t,n);return this._events.push(s),this._startEvent(s),this}return super._addEventListener(e,t,n)}_startEvent(e){[g,"block","filter"].includes(e.type)?this.customStartEvent(e):super._startEvent(e)}_subscribe(e,t,n,s){return(0,i._)(this,void 0,void 0,(function*(){let i=this._subIds[e];const r=yield this.getBlockNumber();null==i&&(i=Promise.all(t).then((e=>this.send("eth_subscribe",e))),this._subIds[e]=i);const o=yield i,l=yield Promise.all(t);this.virtualSubscriptionsById.set(o,{event:s,method:"eth_subscribe",params:l,startingBlockNumber:r,virtualId:o,physicalId:o,sentEvents:[],isBackfilling:!1,backfillBuffer:[]}),this.virtualIdsByPhysicalId.set(o,o),this._subs[o]={tag:e,processFunc:n}}))}emit(e,...t){if(C(e)){let n=!1;const s=[],i=T(e);return this._events=this._events.filter((e=>e.tag!==i||(setTimeout((()=>{e.listener.apply(this,t)}),0),n=!0,!e.once||(s.push(e),!1)))),s.forEach((e=>{this._stopEvent(e)})),n}return super.emit(e,...t)}sendBatch(e){return(0,i._)(this,void 0,void 0,(function*(){let t=0;const n=e.map((({method:e,params:n})=>({method:e,params:n,jsonrpc:"2.0",id:"alchemy-sdk:"+t++}))),s=yield this.sendBatchConcurrently(n),i=s.find((e=>!!e.error));if(i)throw new Error(i.error.message);return s.sort(((e,t)=>e.id-t.id)).map((e=>e.result))}))}destroy(){return this.removeSocketListeners(),this.stopHeartbeatAndBackfill(),super.destroy()}isCommunityResource(){return this.apiKey===i.D}_stopEvent(e){let t=e.tag;if(e.type===g){if(this._events.filter((e=>e.type===g)).length)return}else if("tx"===e.type){if(this._events.filter((e=>"tx"===e.type)).length)return;t="tx"}else if(this.listenerCount(e.event))return;const n=this._subIds[t];n&&(delete this._subIds[t],n.then((e=>{this._subs[e]&&(delete this._subs[e],this.send("eth_unsubscribe",[e]))})))}addSocketListeners(){this._websocket.addEventListener("message",this.handleMessage),this._websocket.addEventListener("reopen",this.handleReopen),this._websocket.addEventListener("down",this.stopHeartbeatAndBackfill)}removeSocketListeners(){this._websocket.removeEventListener("message",this.handleMessage),this._websocket.removeEventListener("reopen",this.handleReopen),this._websocket.removeEventListener("down",this.stopHeartbeatAndBackfill)}resubscribeAndBackfill(e,t){return(0,i._)(this,void 0,void 0,(function*(){const{virtualId:n,method:s,params:i,sentEvents:r,backfillBuffer:o,startingBlockNumber:l}=t;t.isBackfilling=!0,o.length=0;try{const c=yield this.send(s,i);switch(m(e),t.physicalId=c,this.virtualIdsByPhysicalId.set(c,n),i[0]){case"newHeads":{const t=yield w((()=>_(this.backfiller.getNewHeadsBackfill(e,r,l),6e4)),5,(()=>!e()));m(e);(function(e){return p(e,(e=>e.hash))})([...t,...o]).forEach((e=>this.emitNewHeadsEvent(n,e)));break}case"logs":{const t=i[1]||{},s=yield w((()=>_(this.backfiller.getLogsBackfill(e,t,r,l),6e4)),5,(()=>!e()));m(e);(function(e){return p(e,(e=>`${e.blockHash}/${e.logIndex}`))})([...s,...o]).forEach((e=>this.emitLogsEvent(n,e)));break}}}finally{t.isBackfilling=!1,o.length=0}}))}emitNewHeadsEvent(e,t){this.emitAndRememberEvent(e,t,I)}emitLogsEvent(e,t){this.emitAndRememberEvent(e,t,N)}emitAndRememberEvent(e,t,n){this.rememberEvent(e,t,n);const s=this.virtualSubscriptionsById.get(e);s&&this.emitGenericEvent(s,t)}rememberEvent(e,t,n){const s=this.virtualSubscriptionsById.get(e);s&&B(s.sentEvents,Object.assign({},t),n)}emitGenericEvent(e,t){this.emitProcessFn(e.event)(t)}startHeartbeat(){null==this.heartbeatIntervalId&&(this.heartbeatIntervalId=setInterval((()=>(0,i._)(this,void 0,void 0,(function*(){try{yield _(this.send("net_version"),1e4)}catch(e){this._websocket.reconnect()}}))),3e4))}sendBatchConcurrently(e){return(0,i._)(this,void 0,void 0,(function*(){return Promise.all(e.map((e=>this.send(e.method,e.params))))}))}customStartEvent(e){if(e.type===g){const{fromAddress:t,toAddress:n,hashesOnly:s}=e;this._subscribe(e.tag,["alchemy_pendingTransactions",{fromAddress:t,toAddress:n,hashesOnly:s}],this.emitProcessFn(e),e)}else"block"===e.type?this._subscribe("block",["newHeads"],this.emitProcessFn(e),e):"filter"===e.type&&this._subscribe(e.tag,["logs",this._getFilter(e.filter)],this.emitProcessFn(e),e)}emitProcessFn(e){switch(e.type){case g:const{fromAddress:t,toAddress:n,hashesOnly:s}=e;return e=>this.emit({method:"alchemy_pendingTransactions",fromAddress:t,toAddress:n,hashesOnly:s},e);case"block":return e=>{const t=r.BigNumber.from(e.number).toNumber();this._emitted.block=t,this.emit("block",t)};case"filter":return t=>{null==t.removed&&(t.removed=!1),this.emit(e.filter,this.formatter.filterLog(t))};default:throw new Error("Invalid event type to `emitProcessFn()`")}}_off(e,t){if(null==t)return this.removeAllListeners(e);const n=[];let s=!1;const i=T(e);return this._events=this._events.filter((e=>e.tag!==i||e.listener!=t||(!!s||(s=!0,n.push(e),!1)))),n.forEach((e=>{this._stopEvent(e)})),this}_removeAllListeners(e){let t=[];if(null==e)t=this._events,this._events=[];else{const n=T(e);this._events=this._events.filter((e=>e.tag!==n||(t.push(e),!1)))}return t.forEach((e=>{this._stopEvent(e)})),this}_listenerCount(e){if(!e)return this._events.length;const t=T(e);return this._events.filter((e=>e.tag===t)).length}_listeners(e){if(null==e)return this._events.map((e=>e.listener));const t=T(e);return this._events.filter((e=>e.tag===t)).map((e=>e.listener))}}function w(e,t,n=(()=>!0)){return(0,i._)(this,void 0,void 0,(function*(){let s=0,i=0;for(;;)try{return yield e()}catch(e){if(i++,i>=t||!n(e))throw e;if(yield E(s),!n(e))throw e;s=0===s?1e3:Math.min(3e4,2*s)}}))}function E(e){return new Promise((t=>setTimeout(t,e)))}function _(e,t){return Promise.race([e,new Promise(((e,n)=>setTimeout((()=>n(new Error("Timeout"))),t)))])}function I(e){return(0,i.f)(e.number)}function N(e){return(0,i.f)(e.blockNumber)}function B(e,t,n){const s=n(t),i=e.findIndex((e=>n(e)>s-10));-1===i?e.length=0:e.splice(0,i),e.push(t)}function C(e){return"object"==typeof e&&"method"in e}function T(e){if(!C(e))throw new Error("Event tag requires AlchemyEventType");var t;return"alchemy-pending-transactions:"+O(e.fromAddress)+":"+O(e.toAddress)+":"+(void 0===(t=e.hashesOnly)?"*":t.toString())}function O(e){return void 0===e?"*":Array.isArray(e)?e.join("|"):e}},{"./index-dddbb41a.js":"b37PP","@ethersproject/bignumber":"2ZvCv","./alchemy-provider-1b13a2c9.js":"dDMii","sturdy-websocket":"U7OlA","@ethersproject/providers":"cHKP3","@ethersproject/networks":"8EkoS",axios:"f1lqx","@ethersproject/wallet":"iCOdO","@ethersproject/web":"2Uu9c",process:"fDdlt",websocket:"bIXmw","@parcel/transformer-js/src/esmodule-helpers.js":"XTfsy"}],U7OlA:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(t,n,i){if(void 0===i&&(i={}),this.url=t,this.onclose=null,this.onerror=null,this.onmessage=null,this.onopen=null,this.ondown=null,this.onreopen=null,this.CONNECTING=e.CONNECTING,this.OPEN=e.OPEN,this.CLOSING=e.CLOSING,this.CLOSED=e.CLOSED,this.hasBeenOpened=!1,this.isClosed=!1,this.messageBuffer=[],this.nextRetryTime=0,this.reconnectCount=0,this.lastKnownExtensions="",this.lastKnownProtocol="",this.listeners={},null==n||"string"==typeof n||Array.isArray(n)?this.protocols=n:i=n,this.options=function(e){var t={};return Object.keys(s.DEFAULT_OPTIONS).forEach((function(n){var i=e[n];t[n]=void 0===i?s.DEFAULT_OPTIONS[n]:i})),t}(i),!this.options.wsConstructor){if("undefined"==typeof WebSocket)throw new Error("WebSocket not present in global scope and no wsConstructor option was provided.");this.options.wsConstructor=WebSocket}this.openNewWebSocket()}return Object.defineProperty(e.prototype,"binaryType",{get:function(){return this.binaryTypeInternal||"blob"},set:function(e){this.binaryTypeInternal=e,this.ws&&(this.ws.binaryType=e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"bufferedAmount",{get:function(){var e=this.ws?this.ws.bufferedAmount:0,t=!1;return this.messageBuffer.forEach((function(n){var s=function(e){return"string"==typeof e?2*e.length:e instanceof ArrayBuffer?e.byteLength:e instanceof Blob?e.size:void 0}(n);null!=s?e+=s:t=!0})),t&&this.debugLog("Some buffered data had unknown length. bufferedAmount() return value may be below the correct amount."),e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"extensions",{get:function(){return this.ws?this.ws.extensions:this.lastKnownExtensions},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"protocol",{get:function(){return this.ws?this.ws.protocol:this.lastKnownProtocol},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"readyState",{get:function(){return this.isClosed?e.CLOSED:e.OPEN},enumerable:!0,configurable:!0}),e.prototype.close=function(e,t){this.disposeSocket(e,t),this.shutdown(),this.debugLog("WebSocket permanently closed by client.")},e.prototype.send=function(e){if(this.isClosed)throw new Error("WebSocket is already in CLOSING or CLOSED state.");this.ws&&this.ws.readyState===this.OPEN?this.ws.send(e):this.messageBuffer.push(e)},e.prototype.reconnect=function(){if(this.isClosed)throw new Error("Cannot call reconnect() on socket which is permanently closed.");this.disposeSocket(1e3,"Client requested reconnect."),this.handleClose(void 0)},e.prototype.addEventListener=function(e,t){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t)},e.prototype.dispatchEvent=function(e){return this.dispatchEventOfType(e.type,e)},e.prototype.removeEventListener=function(e,t){this.listeners[e]&&(this.listeners[e]=this.listeners[e].filter((function(e){return e!==t})))},e.prototype.openNewWebSocket=function(){var e=this;if(!this.isClosed){var t=this.options,n=t.connectTimeout,s=t.wsConstructor;this.debugLog("Opening new WebSocket to "+this.url+".");var i=new s(this.url,this.protocols);i.onclose=function(t){return e.handleClose(t)},i.onerror=function(t){return e.handleError(t)},i.onmessage=function(t){return e.handleMessage(t)},i.onopen=function(t){return e.handleOpen(t)},this.connectTimeoutId=setTimeout((function(){e.clearConnectTimeout(),e.disposeSocket(),e.handleClose(void 0)}),n),this.ws=i}},e.prototype.handleOpen=function(e){var t=this;if(this.ws&&!this.isClosed){var n=this.options.allClearResetTime;this.debugLog("WebSocket opened."),null!=this.binaryTypeInternal?this.ws.binaryType=this.binaryTypeInternal:this.binaryTypeInternal=this.ws.binaryType,this.clearConnectTimeout(),this.hasBeenOpened?this.dispatchEventOfType("reopen",e):(this.dispatchEventOfType("open",e),this.hasBeenOpened=!0),this.messageBuffer.forEach((function(e){return t.send(e)})),this.messageBuffer=[],this.allClearTimeoutId=setTimeout((function(){t.clearAllClearTimeout(),t.nextRetryTime=0,t.reconnectCount=0;var e=n/1e3|0;t.debugLog("WebSocket remained open for "+e+" seconds. Resetting retry time and count.")}),n)}},e.prototype.handleMessage=function(e){this.isClosed||this.dispatchEventOfType("message",e)},e.prototype.handleClose=function(e){var t=this;if(!this.isClosed){var n=this.options,s=n.maxReconnectAttempts,i=n.shouldReconnect;if(this.clearConnectTimeout(),this.clearAllClearTimeout(),this.ws&&(this.lastKnownExtensions=this.ws.extensions,this.lastKnownProtocol=this.ws.protocol,this.disposeSocket()),this.dispatchEventOfType("down",e),this.reconnectCount>=s)this.stopReconnecting(e,this.getTooManyFailedReconnectsMessage());else{var r=!e||i(e);"boolean"==typeof r?this.handleWillReconnect(r,e,"Provided shouldReconnect() returned false. Closing permanently."):r.then((function(n){t.isClosed||t.handleWillReconnect(n,e,"Provided shouldReconnect() resolved to false. Closing permanently.")}))}}},e.prototype.handleError=function(e){this.dispatchEventOfType("error",e),this.debugLog("WebSocket encountered an error.")},e.prototype.handleWillReconnect=function(e,t,n){e?this.reestablishConnection():this.stopReconnecting(t,n)},e.prototype.reestablishConnection=function(){var e=this,t=this.options,n=t.minReconnectDelay,s=t.maxReconnectDelay,i=t.reconnectBackoffFactor;this.reconnectCount++;var r=this.nextRetryTime;this.nextRetryTime=Math.max(n,Math.min(this.nextRetryTime*i,s)),setTimeout((function(){return e.openNewWebSocket()}),r);var o=r/1e3|0;this.debugLog("WebSocket was closed. Re-opening in "+o+" seconds.")},e.prototype.stopReconnecting=function(e,t){this.debugLog(t),this.shutdown(),e&&this.dispatchEventOfType("close",e)},e.prototype.shutdown=function(){this.isClosed=!0,this.clearAllTimeouts(),this.messageBuffer=[],this.disposeSocket()},e.prototype.disposeSocket=function(e,t){this.ws&&(this.ws.onerror=i,this.ws.onclose=i,this.ws.onmessage=i,this.ws.onopen=i,this.ws.close(e,t),this.ws=void 0)},e.prototype.clearAllTimeouts=function(){this.clearConnectTimeout(),this.clearAllClearTimeout()},e.prototype.clearConnectTimeout=function(){null!=this.connectTimeoutId&&(clearTimeout(this.connectTimeoutId),this.connectTimeoutId=void 0)},e.prototype.clearAllClearTimeout=function(){null!=this.allClearTimeoutId&&(clearTimeout(this.allClearTimeoutId),this.allClearTimeoutId=void 0)},e.prototype.dispatchEventOfType=function(e,t){var n=this;switch(e){case"close":this.onclose&&this.onclose(t);break;case"error":this.onerror&&this.onerror(t);break;case"message":this.onmessage&&this.onmessage(t);break;case"open":this.onopen&&this.onopen(t);break;case"down":this.ondown&&this.ondown(t);break;case"reopen":this.onreopen&&this.onreopen(t)}return e in this.listeners&&this.listeners[e].slice().forEach((function(e){return n.callListener(e,t)})),!t||!t.defaultPrevented},e.prototype.callListener=function(e,t){"function"==typeof e?e.call(this,t):e.handleEvent.call(this,t)},e.prototype.debugLog=function(e){this.options.debug&&console.log(e)},e.prototype.getTooManyFailedReconnectsMessage=function(){var e,t=this.options.maxReconnectAttempts;return"Failed to reconnect after "+t+" "+(e="attempt",(1===t?e:e+"s")+". Closing permanently.")},e.DEFAULT_OPTIONS={allClearResetTime:5e3,connectTimeout:5e3,debug:!1,minReconnectDelay:1e3,maxReconnectDelay:3e4,maxReconnectAttempts:Number.POSITIVE_INFINITY,reconnectBackoffFactor:1.5,shouldReconnect:function(){return!0},wsConstructor:void 0},e.CONNECTING=0,e.OPEN=1,e.CLOSING=2,e.CLOSED=3,e}();function i(){}n.default=s},{}],bIXmw:[function(e,t,n){var s;if("object"==typeof globalThis)s=globalThis;else try{s=e("es5-ext/global")}catch(e){}finally{if(s||"undefined"==typeof window||(s=window),!s)throw new Error("Could not determine global this")}var i=s.WebSocket||s.MozWebSocket,r=e("./version");function o(e,t){return t?new i(e,t):new i(e)}i&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach((function(e){Object.defineProperty(o,e,{get:function(){return i[e]}})})),t.exports={w3cwebsocket:i?o:null,version:r}},{"es5-ext/global":"kHIxd","./version":"gDrNE"}],kHIxd:[function(e,t,n){var s=function(){if("object"==typeof self&&self)return self;if("object"==typeof window&&window)return window;throw new Error("Unable to resolve global `this`")};t.exports=function(){if(this)return this;if("object"==typeof globalThis&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch(e){return s()}try{return __global__||s()}finally{delete Object.prototype.__global__}}()},{}],gDrNE:[function(e,t,n){t.exports=e("../package.json").version},{"../package.json":"dhU4A"}],dhU4A:[function(e,t,n){t.exports=JSON.parse('{"name":"websocket","description":"Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.","keywords":["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],"author":"Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)","contributors":["Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"],"version":"1.0.34","repository":{"type":"git","url":"https://github.com/theturtle32/WebSocket-Node.git"},"homepage":"https://github.com/theturtle32/WebSocket-Node","engines":{"node":">=4.0.0"},"dependencies":{"bufferutil":"^4.0.1","debug":"^2.2.0","es5-ext":"^0.10.50","typedarray-to-buffer":"^3.1.5","utf-8-validate":"^5.0.2","yaeti":"^0.0.6"},"devDependencies":{"buffer-equal":"^1.0.0","gulp":"^4.0.2","gulp-jshint":"^2.0.4","jshint-stylish":"^2.2.1","jshint":"^2.0.0","tape":"^4.9.1"},"config":{"verbose":false},"scripts":{"test":"tape test/unit/*.js","gulp":"gulp"},"main":"index","directories":{"lib":"./lib"},"browser":"lib/browser.js","license":"Apache-2.0"}')},{}]},[]);