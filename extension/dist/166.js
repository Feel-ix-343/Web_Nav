"use strict";(self.webpackChunkWeb_nav_Extension=self.webpackChunkWeb_nav_Extension||[]).push([[166],{166:(n,e,t)=>{t.r(e),t.d(e,{WebAnalyzation:()=>R,default:()=>z,initSync:()=>I,initThreadPool:()=>k,wbg_rayon_PoolBuilder:()=>x,wbg_rayon_start_worker:()=>W});var r=t(606);let _;const o=new Array(32).fill(void 0);function i(n){return o[n]}o.push(void 0,null,!0,!1);let a=o.length;function b(n){const e=i(n);return function(n){n<36||(o[n]=a,a=n)}(n),e}function c(n){a===o.length&&o.push(o.length+1);const e=a;return a=o[e],o[e]=n,e}const u=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});let s;function w(){return s.buffer!==_.memory.buffer&&(s=new Uint8Array(_.memory.buffer)),s}function f(n,e){return u.decode(w().slice(n,n+e))}u.decode();let g=0;const d=new TextEncoder("utf-8");function l(n,e,t){if(void 0===t){const t=d.encode(n),r=e(t.length);return w().subarray(r,r+t.length).set(t),g=t.length,r}let r=n.length,_=e(r);const o=w();let i=0;for(;i<r;i++){const e=n.charCodeAt(i);if(e>127)break;o[_+i]=e}if(i!==r){0!==i&&(n=n.slice(i)),_=t(_,r,r=i+3*n.length);const e=function(n,e){const t=d.encode(n);return e.set(t),{read:n.length,written:t.length}}(n,w().subarray(_+i,_+r));i+=e.written}return g=i,_}let y,m;function p(){return y.buffer!==_.memory.buffer&&(y=new Int32Array(_.memory.buffer)),y}function h(n,e,t,r){const o={a:n,b:e,cnt:1,dtor:t},i=(...n)=>{o.cnt++;const e=o.a;o.a=0;try{return r(e,o.b,...n)}finally{0==--o.cnt?_.__wbindgen_export_3.get(o.dtor)(e,o.b):o.a=e}};return i.original=o,i}function A(n,e,t){_._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8c43bd11fcb9bc93(n,e,c(t))}function v(n,e){try{return n.apply(this,e)}catch(n){_.__wbindgen_exn_store(c(n))}}function k(n){return b(_.initThreadPool(n))}function W(n){_.wbg_rayon_start_worker(n)}class R{static __wrap(n){const e=Object.create(R.prototype);return e.ptr=n,e}__destroy_into_raw(){const n=this.ptr;return this.ptr=0,n}free(){const n=this.__destroy_into_raw();_.__wbg_webanalyzation_free(n)}static new(n){const e=function(n,e){const t=e(4*n.length),r=(m.buffer!==_.memory.buffer&&(m=new Uint32Array(_.memory.buffer)),m);for(let e=0;e<n.length;e++)r[t/4+e]=c(n[e]);return g=n.length,t}(n,_.__wbindgen_malloc),t=g;return b(_.webanalyzation_new(e,t))}get_graph(){try{const t=_.__wbindgen_add_to_stack_pointer(-16);_.webanalyzation_get_graph(t,this.ptr);var n=p()[t/4+0],e=p()[t/4+1];if(p()[t/4+2])throw b(e);return b(n)}finally{_.__wbindgen_add_to_stack_pointer(16)}}get_edges(n,e,t){try{const i=_.__wbindgen_add_to_stack_pointer(-16),a=l(n,_.__wbindgen_malloc,_.__wbindgen_realloc),c=g,u=l(e,_.__wbindgen_malloc,_.__wbindgen_realloc),s=g;_.webanalyzation_get_edges(i,this.ptr,a,c,u,s,t);var r=p()[i/4+0],o=p()[i/4+1];if(p()[i/4+2])throw b(o);return b(r)}finally{_.__wbindgen_add_to_stack_pointer(16)}}}class x{static __wrap(n){const e=Object.create(x.prototype);return e.ptr=n,e}__destroy_into_raw(){const n=this.ptr;return this.ptr=0,n}free(){const n=this.__destroy_into_raw();_.__wbg_wbg_rayon_poolbuilder_free(n)}numThreads(){return _.wbg_rayon_poolbuilder_numThreads(this.ptr)>>>0}receiver(){return _.wbg_rayon_poolbuilder_receiver(this.ptr)}build(){_.wbg_rayon_poolbuilder_build(this.ptr)}}function M(){const n={wbg:{}};return n.wbg.__wbindgen_object_drop_ref=function(n){b(n)},n.wbg.__wbg_webanalyzation_new=function(n){return c(R.__wrap(n))},n.wbg.__wbg_title_d04bb8def28b5049=function(n,e){const t=l(i(e).title,_.__wbindgen_malloc,_.__wbindgen_realloc),r=g;p()[n/4+1]=r,p()[n/4+0]=t},n.wbg.__wbg_url_bbb36d4b4ca7d7a7=function(n,e){const t=l(i(e).url,_.__wbindgen_malloc,_.__wbindgen_realloc),r=g;p()[n/4+1]=r,p()[n/4+0]=t},n.wbg.__wbg_visitcount_92397da46723acdb=function(n){return i(n).visitCount},n.wbg.__wbg_new_68adb0d58759a4ed=function(){return c(new Object)},n.wbg.__wbindgen_number_new=function(n){return c(n)},n.wbg.__wbg_set_2e79e744454afade=function(n,e,t){i(n)[b(e)]=b(t)},n.wbg.__wbindgen_string_new=function(n,e){return c(f(n,e))},n.wbg.__wbindgen_object_clone_ref=function(n){return c(i(n))},n.wbg.__wbindgen_is_undefined=function(n){return void 0===i(n)},n.wbg.__wbindgen_string_get=function(n,e){const t=i(e),r="string"==typeof t?t:void 0;var o=null==r?0:l(r,_.__wbindgen_malloc,_.__wbindgen_realloc),a=g;p()[n/4+1]=a,p()[n/4+0]=o},n.wbg.__wbindgen_cb_drop=function(n){const e=b(n).original;return 1==e.cnt--&&(e.a=0,!0)},n.wbg.__wbg_waitAsync_330eb512f6e175f6=function(){return c(Atomics.waitAsync)},n.wbg.__wbg_waitAsync_dba9c16a554f262d=function(n,e,t){return c(Atomics.waitAsync(i(n),e,t))},n.wbg.__wbg_async_9bae62b1ade37fe2=function(n){return i(n).async},n.wbg.__wbg_value_2bd01c1356da77f6=function(n){return c(i(n).value)},n.wbg.__wbg_data_751f064cdd700ef0=function(n){return c(i(n).data)},n.wbg.__wbg_setonmessage_a3c3e221c33219db=function(n,e){i(n).onmessage=i(e)},n.wbg.__wbg_new_072d8a04b23f519d=function(){return v((function(n,e){return c(new Worker(f(n,e)))}),arguments)},n.wbg.__wbg_postMessage_5b2760aaaa9d1284=function(){return v((function(n,e){i(n).postMessage(i(e))}),arguments)},n.wbg.__wbg_new_2ab697f1555e0dbc=function(){return c(new Array)},n.wbg.__wbg_new_f0540490a24a79bb=function(){return c(new Map)},n.wbg.__wbg_encodeURIComponent_8bdf87f4b3f85256=function(n,e){return c(encodeURIComponent(f(n,e)))},n.wbg.__wbg_of_891992dde2057125=function(n,e,t){return c(Array.of(i(n),i(e),i(t)))},n.wbg.__wbg_push_811c8b08bf4ff9d5=function(n,e){return i(n).push(i(e))},n.wbg.__wbg_call_9855a4612eb496cb=function(){return v((function(n,e,t){return c(i(n).call(i(e),i(t)))}),arguments)},n.wbg.__wbg_set_e44d2fe94a18567f=function(n,e,t){return c(i(n).set(i(e),i(t)))},n.wbg.__wbg_new_78403b138428b684=function(n,e){try{var t={a:n,b:e};const r=new Promise(((n,e)=>{const r=t.a;t.a=0;try{return function(n,e,t,r){_.wasm_bindgen__convert__closures__invoke2_mut__h607bc3ac1309d673(n,e,c(t),c(r))}(r,t.b,n,e)}finally{t.a=r}}));return c(r)}finally{t.a=t.b=0}},n.wbg.__wbg_resolve_f269ce174f88b294=function(n){return c(Promise.resolve(i(n)))},n.wbg.__wbg_then_1c698eedca15eed6=function(n,e){return c(i(n).then(i(e)))},n.wbg.__wbg_buffer_de1150f91b23aa89=function(n){return c(i(n).buffer)},n.wbg.__wbg_new_c5909f2edcd0f06c=function(n){return c(new Int32Array(i(n)))},n.wbg.__wbindgen_throw=function(n,e){throw new Error(f(n,e))},n.wbg.__wbindgen_rethrow=function(n){throw b(n)},n.wbg.__wbindgen_module=function(){return c(T.__wbindgen_wasm_module)},n.wbg.__wbindgen_memory=function(){return c(_.memory)},n.wbg.__wbg_startWorkers_04f63eca19916b8f=function(n,e,t){return c((0,r.Q)(b(n),b(e),x.__wrap(t)))},n.wbg.__wbindgen_closure_wrapper172=function(n,e,t){return c(h(n,e,33,A))},n.wbg.__wbindgen_closure_wrapper173=function(n,e,t){return c(h(n,e,33,A))},n}function U(n,e){n.wbg.memory=e||new WebAssembly.Memory({initial:18,maximum:16384,shared:!0})}function C(n,e){return _=n.exports,T.__wbindgen_wasm_module=e,y=new Int32Array(_.memory.buffer),m=new Uint32Array(_.memory.buffer),s=new Uint8Array(_.memory.buffer),_.__wbindgen_start(),_}function I(n,e){const t=M();U(t,e);const r=new WebAssembly.Module(n);return C(new WebAssembly.Instance(r,t),r)}async function T(n,e){void 0===n&&(n=new URL(t(133),t.b));const r=M();("string"==typeof n||"function"==typeof Request&&n instanceof Request||"function"==typeof URL&&n instanceof URL)&&(n=fetch(n)),U(r,e);const{instance:_,module:o}=await async function(n,e){if("function"==typeof Response&&n instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(n,e)}catch(e){if("application/wasm"==n.headers.get("Content-Type"))throw e;console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",e)}const t=await n.arrayBuffer();return await WebAssembly.instantiate(t,e)}{const t=await WebAssembly.instantiate(n,e);return t instanceof WebAssembly.Instance?{instance:t,module:n}:t}}(await n,r);return C(_,o)}const z=T},133:(n,e,t)=>{n.exports=t.p+"fad63c2668884ed6f130.wasm"}}]);