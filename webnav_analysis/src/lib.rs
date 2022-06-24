use wasm_bindgen::{prelude::*, JsCast};


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

use js_sys::{Reflect::get, JsString};

#[wasm_bindgen]
pub async fn log_hist(p: js_sys::Promise) {
    // Wish I could use types with this ........ maybe in the future ...... 
    let history_arr_val = wasm_bindgen_futures::JsFuture::from(p)
        .await
        .unwrap();

    console_log!("{:?}", history_arr_val);

    let iterator = js_sys::try_iter(&history_arr_val).unwrap().unwrap();

    for history_item in iterator {
        let id = get(&history_item.as_ref().unwrap(), &JsValue::from("id")).unwrap();
        console_log!("History item: {:?}", id);
    }


    // let o = get(&h, &JsValue::from("0")).unwrap();
    // let id = get(&o, &JsValue::from("id")).unwrap();
    // let id_no: &JsString = id.dyn_ref().unwrap();
    // console_log!("{:?}", id_no)
}

