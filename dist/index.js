(()=>{var e=class{constructor(){this._subscribers=[]}subscribe(t){this._subscribers.push(t)}publish(...t){for(let s of this._subscribers)s(...t)}};var n=class extends e{constructor(t=[]){super(),this._internal=[];for(let s of t)this.push(s)}_makeSubscriberFunc(t){return(s,r=null)=>{this.publish(s,r?`${t}.${r}`:`${t}`)}}_makeAndSubscribe(t,s){let r=c(t);return r.subscribe(this._makeSubscriberFunc(s)),r}static(){return this._internal.map(t=>t.static())}push(t){let s=this._internal.length,r=this._makeAndSubscribe(r,s);this._internal.push(r),this.publish(t,`${s}`)}};var u=class extends e{constructor(t={}){super(),this._internal={};for(let s in t)this.set(s,t[s])}_makeSubscriberFunc(t){return(s,r=null)=>{this.publish(s,r?`${t}.${r}`:t)}}_makeAndSubscribe(t,s){let r=c(t);return r.subscribe(this._makeSubscriberFunc(s)),r}static(){let t={};for(let s in this._internal)t[s]=this._internal[s].static()}set(t,s){if(this._internal[t]!==void 0)this._internal[t].set(s);else{let r=this._makeAndSubscribe(s,t);this._internal[t]=r,this.publish(s,t)}}get(t){return this._internal[t]}};function c(i){return typeof i=="object"?Array.isArray(i)?new n(i):new u(i):new o(i)}var o=class extends e{constructor(t){super(),this._value=t}get(){return this._value}set(t){this._value=t,this.publish(this._value)}static(){return this._value}};})();
//# sourceMappingURL=index.js.map
