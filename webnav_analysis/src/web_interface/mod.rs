use serde::{Serialize, Deserialize};
use wasm_bindgen::prelude::*;
pub use wasm_bindgen_test::console_log;

use crate::history_graph::HistoryGraph;

mod web_functions;
use web_functions::HistoryItem;
pub use web_functions::performance;


// TODO: Check if this is faster than using a JsString. It might be
/// Rust Representation of the typescript history item
#[derive(Debug, Eq, Ord, PartialEq, PartialOrd, Serialize, Deserialize, Clone, Hash)]
pub struct RustHistoryItem {
    pub title: String,
    pub url: String,
    pub visit_count: i32,
}

impl RustHistoryItem {
    fn from(h: &HistoryItem) -> RustHistoryItem {
        RustHistoryItem {
            title: h.title(),
            url: h.url(),
            visit_count: h.visit_count()
        }
    }
}



#[wasm_bindgen]
pub struct WebAnalyzation {
    history_graph: HistoryGraph,
}


#[wasm_bindgen]
impl WebAnalyzation {
    #[wasm_bindgen(constructor)]
    pub fn new (history: Vec<HistoryItem>) -> WebAnalyzation {

        let rust_history_items: Vec<RustHistoryItem> = history
            .into_iter()
            .map(|h| RustHistoryItem::from(&h))
            .collect();

        let history_graph = HistoryGraph::new(&rust_history_items);

        let r = WebAnalyzation { history_graph };

        r
    }

    // TODO: Try to turn this into typescript types
    #[wasm_bindgen]
    pub fn get_edges(&self, title: String, url: String, visit_count: i32) -> Result<JsValue, JsValue>{
        let q = RustHistoryItem {
            title,
            url,
            visit_count
        };
        let r = serde_wasm_bindgen::to_value(&self.history_graph.get_edges(&q).map(|h| h.to_owned()))?;
        Ok(r)
    }
}
