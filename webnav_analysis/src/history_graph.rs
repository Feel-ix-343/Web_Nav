
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use crate::HistoryItem;

#[wasm_bindgen]
#[derive(Debug)]
pub struct HistoryGraph {
    data: HashMap<String, Vec<String>>
}

#[wasm_bindgen]
impl HistoryGraph {
    #[wasm_bindgen]
    pub fn new(history_arr: Vec<HistoryItem>) -> HistoryGraph { // TODO: Make sure these are just bindings and not a full copy in js
        todo!();
    }

    #[wasm_bindgen]
    pub fn get_edges(&self, vertex: HistoryItem) -> Vec<HistoryItem> {
        todo!();
    }

    #[wasm_bindgen]
    pub fn get_edge_count(&self, vertex: HistoryItem) -> usize {
        self.get_edges(vertex).len()
    }
}
