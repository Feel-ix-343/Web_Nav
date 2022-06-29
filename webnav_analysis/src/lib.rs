use js_sys::JsString;
use wasm_bindgen::prelude::*;

mod history_graph;
use history_graph::{HistoryGraph, HistoryGraphItem};

// mod filter_scoring;




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




#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "chrome.history.HistoryItem")]
    #[derive(Debug, Default, PartialEq)]
    pub type HistoryItem;

    #[wasm_bindgen(method, getter)]
    pub fn title(this: &HistoryItem) -> String;

    #[wasm_bindgen(method, getter)]
    pub fn url(this: &HistoryItem) -> String;

    #[wasm_bindgen(method, getter = visitCount)]
    pub fn visit_count(this: &HistoryItem) -> i32;
}


#[wasm_bindgen]
pub struct SearchProcess {
    history_graph: HistoryGraph,
}

#[wasm_bindgen]
impl SearchProcess {
    #[wasm_bindgen(constructor)]
    pub fn new (history: Vec<HistoryItem>) -> SearchProcess {
        SearchProcess { history_graph: HistoryGraph::new(history) }
    }

    #[wasm_bindgen]
    pub fn get_graph(&self) -> Result<JsValue, JsValue> {

        let js_value = serde_wasm_bindgen::to_value(&self.history_graph.data)?;

        Ok(js_value)
    }

    #[wasm_bindgen]
    pub fn get_edges(&self, title: String, url: String) -> Result<JsValue, JsValue> {
        let q = HistoryGraphItem {
            title,
            url
        };

        let js_value = serde_wasm_bindgen::to_value(&self.history_graph.get_edges(q))?;

        Ok(js_value)
    }
}






#[wasm_bindgen]
pub fn test() {
    console_log!("Hello from wasm")
}
