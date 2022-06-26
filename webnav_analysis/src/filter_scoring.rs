use crate::{HistoryItem, HistoryGraph};

/// Returns the match score from a filter to a function in the form of ((pure text match score),
/// (visit count + graph edges))
pub fn filter_match_score(filter: &str, history_graph: HistoryGraph, history_item: HistoryItem) -> (i32, i32) {
    todo!();
}


/// Finds all possible sublists of filter_list (in all orders) and matches them sublists of
/// history_title_list
fn sublist_intersections(filter_list: Vec<String>, history_title_list: Vec<String>) -> bool {
    todo!();
}


/// Take a list of words from filter split at every space, and returs all substrings of all words
fn word_partitions(filter_list: Vec<String>) -> Vec<Vec<String>> {
    todo!();
}
