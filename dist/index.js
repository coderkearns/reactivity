(()=>{var e=class extends r{constructor(t){super(),this._value=t}get(){return this._value}set(t){this._value=t,this.publish(this._value)}static(){return this._value}};var i=class extends r{constructor(t){super(),this._internal=[];for(let s of t)this._internal.push(r.from(s))}static(){return this._internal.map(t=>t.static())}};var o=class extends r{constructor(t){super(),this._internal={};for(let s in t)this._internal[s]=r.from(t[s])}static(){let t={};for(let s in this._internal)t[s]=this._internal[s].static()}};var r=class{constructor(){this._subscribers=[]}subscribe(t){this._subscribers.push(t)}publish(...t){for(let s of this._subscribers)s(...t)}static from(t){return typeof t=="object"?Array.isArray(t)?new i(t):new o(t):new e(t)}};})();
//# sourceMappingURL=index.js.map
