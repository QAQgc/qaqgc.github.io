var f=Object.defineProperty;var d=Object.getOwnPropertySymbols;var g=Object.prototype.hasOwnProperty,h=Object.prototype.propertyIsEnumerable;var e=(c,a,b)=>a in c?f(c,a,{enumerable:!0,configurable:!0,writable:!0,value:b}):c[a]=b,i=(c,a)=>{for(var b in a||(a={}))g.call(a,b)&&e(c,b,a[b]);if(d)for(var b of d(a))h.call(a,b)&&e(c,b,a[b]);return c};var j=(c,a)=>{for(var b in a)f(c,b,{get:a[b],enumerable:!0})};export{i as a,j as b};
