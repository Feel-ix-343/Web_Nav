use itertools::Itertools;
use wasm_timer::Instant;

use js_sys::JsString;
use serde::{Deserialize, Serialize};
use wasm_bindgen::{prelude::*, JsCast};

use history_graph::HistoryGraph;



mod history_graph;
mod filter_scoring;




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



// TODO: Check if this is faster than using a JsString. It might be
#[derive(Debug, Eq, Ord, PartialEq, PartialOrd, Serialize, Clone)]
pub struct RustHistoryItem {
    title: String,
    url: String,
    visit_count: i32
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


        let now = wasm_timer::Instant::now();

        let rust_history_items: Vec<RustHistoryItem> = history
            .into_iter()
            .map(|h| RustHistoryItem::from(&h))
            .collect();

        let history_graph = HistoryGraph::new(&rust_history_items);

        let r = WebAnalyzation { 
            history_items: rust_history_items, 
            history_graph
        };

        console_log!("Graph setup took: {}", now.elapsed().as_millis());

        r
    }

    #[wasm_bindgen]
    pub fn get_search_results(&self, filter: String) -> Result<JsValue, JsValue> {

        // TODO: Make faster: Calc everything ahead of time, partitions etc. 


        let now = wasm_timer::Instant::now();
        // Scores all of the history items, and returns the index as the last tuple item
        let match_scoring = self.history_items.iter().map(|h| MatchResult {
            score: filter_scoring::filter_match_score(&filter, &self.history_graph, h),
            history_item: &h
        }).collect_vec();

        console_log!("Match scoring took {}ms", now.elapsed().as_millis());

        let r = match_scoring.iter().sorted_by_key(|m| (-m.score.0, -m.score.1)).collect_vec();
        console_log!("Sorting took: {}ms", now.elapsed().as_millis());

        // let r = self.history_items.iter().sorted_by_key(|&x| {
        //     let r = filter_scoring::filter_match_score(&filter, &self.history_graph, x);
        //     (-(r.0 as i32), -(r.1 as i32))
        // }).collect_vec();

        // console_log!("{:?}", r[..15].to_vec());
        

        let x = serde_wasm_bindgen::to_value(&r[..15].to_vec())?;

        Ok(x)
    }

    #[wasm_bindgen]
    pub fn get_graph(&self) -> Result<JsValue, JsValue> {

        let js_value = serde_wasm_bindgen::to_value(&self.history_graph.data)?;


        Ok(js_value)
    }

    #[wasm_bindgen]
    pub fn get_edges(&self, title: String, url: String, visit_count: i32) -> Result<JsValue, JsValue>{
        let now = wasm_timer::Instant::now();
        let q = RustHistoryItem {
            title,
            url,
            visit_count
        };
        let r = serde_wasm_bindgen::to_value(&self.history_graph.get_edges(&q).map(|h| h.to_owned()))?;
        console_log!("Took: {}", now.elapsed().as_millis());
        Ok(r)

    }
}
