use std::rc::Rc;

use itertools::Itertools;


use js_sys::Promise;
use rayon::prelude::*;
use wasm_bindgen_futures::future_to_promise;
pub use::wasm_bindgen_rayon::init_thread_pool;

use serde::{Serialize, Deserialize};
use wasm_bindgen::prelude::*;

use history_graph::HistoryGraph;



mod history_graph;
mod filter_scoring;




#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

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



// TODO: Check if this is faster than using a JsString. It might be
#[derive(Debug, Eq, Ord, PartialEq, PartialOrd, Serialize, Deserialize, Clone)]
pub struct RustHistoryItem {
    title: String,
    url: String,
    visit_count: i32,
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

#[derive(Serialize, Debug, Clone, Copy)]
struct MatchResult<'a> {
    score: (i32, i32),
    history_item: &'a RustHistoryItem
}

#[wasm_bindgen]
pub struct WebAnalyzation {
    history_items: Vec<RustHistoryItem>,
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

        let r = WebAnalyzation { 
            history_items: rust_history_items, 
            history_graph
        };

        r
    }

    #[wasm_bindgen]
    pub fn get_search_results(&self, filter: String) -> Promise {

        let history_items = self.history_items.to_owned();
        let history_graph = self.history_graph.to_owned();
        

        future_to_promise(async move {
            // TODO: Make faster: Calc everything ahead of time, partitions etc. 
            // Scores all of the history items, and returns the index as the last tuple item
            let match_scoring: Vec<MatchResult> = history_items.iter().map(|h| MatchResult {
                score: filter_scoring::filter_match_score(&filter, &history_graph, h),
                history_item: &h
            }).collect();



            let r = match_scoring.iter().sorted_by_key(|m| (-m.score.0, -m.score.1)).collect_vec();


            let x = serde_wasm_bindgen::to_value(&r[..15].to_vec())?;

            Ok(x)
        })
    }

    #[wasm_bindgen]
    pub fn get_graph(&self) -> Result<JsValue, JsValue> {

        let js_value = serde_wasm_bindgen::to_value(&self.history_graph.data)?;


        Ok(js_value)
    }

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

#[wasm_bindgen]
pub fn get_search_results(search_process: &WebAnalyzation, filter: String) -> Promise {

    let history_items = search_process.history_items.to_owned();
    let history_graph = search_process.history_graph.to_owned();
    

    future_to_promise(async move {
        // TODO: Make faster: Calc everything ahead of time, partitions etc. 
        // Scores all of the history items, and returns the index as the last tuple item
        let match_scoring: Vec<MatchResult> = history_items.iter().map(|h| MatchResult {
            score: filter_scoring::filter_match_score(&filter, &history_graph, h),
            history_item: &h
        }).collect();



        let r = match_scoring.iter().sorted_by_key(|m| (-m.score.0, -m.score.1)).collect_vec();


        let x = serde_wasm_bindgen::to_value(&r[..15].to_vec())?;

        Ok(x)
    })
}
