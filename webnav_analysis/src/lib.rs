use wasm_bindgen::prelude::*;

mod history_graph;
use history_graph::HistoryGraph;

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
    #[derive(Debug)]
    pub type HistoryItem;

    #[wasm_bindgen(method, getter)]
    pub fn title(this: &HistoryItem) -> String;

    #[wasm_bindgen(method, getter)]
    pub fn url(this: &HistoryItem) -> String;

    #[wasm_bindgen(method, getter = visitCount)]
    pub fn visit_count(this: &HistoryItem) -> i32;
}




#[wasm_bindgen]
/// Getting the search results. Accepts a search filter, already created graph, and history array
/// from the chrome.history.search api. Returns a list of Top history Item matches
pub fn get_search_results(filter: &str, history_graph: HistoryGraph, history_arr: Vec<HistoryItem>) -> Vec<HistoryItem> {
    console_log!("{:?}", history_arr[0]);
    console_log!("Title: {:?}", history_arr[0].title());
    console_log!("Url: {:?}", history_arr[0].url());
    console_log!("VisitCount: {:?}", history_arr[0].visit_count());

    todo!();
}





