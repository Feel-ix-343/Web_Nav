use serde::Deserialize;

use std::collections::BTreeMap;
use crate::web_interface::{RustHistoryItem, console_log, performance};

#[derive(Debug, Deserialize, Clone)]
pub struct HistoryGraph {
    pub data: BTreeMap<RustHistoryItem, Vec<RustHistoryItem>>
}

/// Example: github.com
type BaseUrl = String;

/// Basically the number of "/" in the URL; For example: https://github.com/felix/is/ has a url depth of 2
type UrlDepth = u32;

/// Map of rust history items indexed by their url depth;
type UrlDepths<'a> = BTreeMap<UrlDepth, Vec<&'a RustHistoryItem>>;



impl HistoryGraph {
    pub fn new(history_arr: &Vec<RustHistoryItem>) -> HistoryGraph { 
        // Groups the history items into a datastrucutre by the following: {base (github.com) -> {depth, history item}}
        let grouped_by_baseurl_with_depths = group_history_arr(history_arr);

        // Getting rid of the grouped by depth for simlicity later
        let grouped_by_baseurl: BTreeMap<&BaseUrl, Vec<&RustHistoryItem>> = grouped_by_baseurl_with_depths
            .iter()
            .map(|(baseurl, base_with_depths)| -> (&BaseUrl, Vec<&RustHistoryItem>) {
                (baseurl, base_with_depths
                 .values()
                 .flatten()
                 .map(|h: &&RustHistoryItem| *h) // Copying the reference instead of cloning
                 .collect::<Vec<&RustHistoryItem>>()
                )
            })
            .collect();

        // A graph rule is something like Link -> Link, or in this case (Link, Link).
        let baseurl_graph_rules: BTreeMap<&BaseUrl, Vec<(&RustHistoryItem, &RustHistoryItem)>> = grouped_by_baseurl
            .iter()
            .map(|(&base, history_items)| {
                let base_with_depths = &grouped_by_baseurl_with_depths[base];
                (base, base_with_links(base_with_depths, &history_items))
            })
        .collect();

        console_log!("{}", performance.now());

        let all_rules: Vec<&(&RustHistoryItem, &RustHistoryItem)> = baseurl_graph_rules.values().flatten().collect();


        HistoryGraph {
            data: all_rules
                .iter()
                .fold(BTreeMap::new(), |mut map, &&(parent, child)| {
                    let parent_children = map.entry(parent.clone()).or_insert(vec![]);
                    parent_children.push(child.clone());
                    map
                })
        }

    }

    pub fn get_edges(&self, vertex: &RustHistoryItem) -> Option<&Vec<RustHistoryItem>> {
        self.data.get(vertex)
    }
}

fn group_history_arr (history_arr: &Vec<RustHistoryItem>) -> BTreeMap<BaseUrl, UrlDepths> {
    let mut grouped: BTreeMap<BaseUrl, UrlDepths> = BTreeMap::new();


    for history_item in history_arr {
        let url_path_list: Vec<String> = url_path_list(&history_item.url);  

        let baseurl: BaseUrl = url_path_list[0].to_owned();

        let base_items = grouped.entry(baseurl).or_insert(BTreeMap::new()); // Either finds that there is a baseurl entry already, or creates one
        let base_items_by_depth = base_items.entry(url_path_list.len() as u32).or_insert(vec![]); // Same method as above, but for the depth for the url
        base_items_by_depth.push(history_item);
    }

    return grouped
}



/// Splits Urls by the '/' in them.
/// Helper Method
fn url_path_list(url: &String) -> Vec<String> {
    let mut url_simplified = url
        .replacen("https://", "", 1)
        .replacen("http://", "", 1);

    if &url_simplified[url_simplified.len()-1..] == "/" {
        url_simplified.remove(url_simplified.len()-1);
    }

    url_simplified.split("/").map(|s| s.to_owned()).collect()
}


fn base_with_links<'a>( baseurl_depth_lists: &'a BTreeMap<u32, Vec<&RustHistoryItem>>,
                        base_hist_items: &'a Vec<&RustHistoryItem>
                      ) -> Vec<(&'a RustHistoryItem, &'a RustHistoryItem)> {



    let rules = base_hist_items
        .iter()
        .fold(Vec::new(), |mut graph, &history_item| { 
            match find_parent_item(history_item, baseurl_depth_lists, None) {
                Some(link) => {
                    graph.push(link);
                    graph
                },
                None => graph
            }
        });

    return rules
}


/// Searches recursively through a map of baseurl depth lists to find the parent hist item (based
/// on the url) for the given hist item. Returns a tuple (parent item found, inputted_history_item)
fn find_parent_item<'a>(hist_item: &'a RustHistoryItem, 
                        baseurl_depth_lists: &'a BTreeMap<u32, Vec<&RustHistoryItem>>,
                        depth_option: Option<u32>) -> Option<(&'a RustHistoryItem, &'a RustHistoryItem)> {

    let hist_item_url_list = url_path_list(&hist_item.url); 
    let hist_url_list_len = hist_item_url_list.len() as u32;


    let depth = depth_option.unwrap_or(hist_url_list_len); // Either the depth is specified (recursive) or it is None (Called by base with links)


    let depths: Vec<u32> = baseurl_depth_lists.keys().map(|d| *d).collect();
    let min_depth: u32 = *(depths.iter().min().unwrap());

    if hist_url_list_len == min_depth { // No parent
        return None;
    }

    if depth <= min_depth {
        return Some((baseurl_depth_lists[&min_depth][0], hist_item))
    } else {
        if depths.contains(&(depth - 1)) { // The possible parent depth (depth - 1) needs to exist in the base

            let hist_item_url_list_drop_last = &hist_item_url_list[..(depth as usize)-1];

            // Checking if the parent depth contains a parent hist item match
            for possible_par_hist_item in baseurl_depth_lists[&(depth-1)].as_slice() {
                let parent_url_list = url_path_list(&possible_par_hist_item.url);

                if hist_item_url_list_drop_last == parent_url_list { // A match has been found
                    return Some((possible_par_hist_item, hist_item))
                }
            }
        }
        return find_parent_item(&hist_item, &baseurl_depth_lists, Some(depth-1))
    }
}





#[cfg(test)]
pub mod tests {

    use super::*;

    #[test]
    fn url_list_is_correct() {
        let url = "https://github.com/this/is/a/test/".to_string();

        let expected_list = vec!["github.com","this","is","a","test"];

        debug_assert_eq!(url_path_list(&url),expected_list)
    }

    #[test]
    fn url_list_is_correct_when_no_last_slash() {
        let url = "https://github.com/test".to_string();

        let expected = vec!["github.com", "test"];

        debug_assert_eq!(expected, url_path_list(&url))
    }



    #[test]
    fn test_find_parent_when_only_baseurl() {
        let hist_item = RustHistoryItem { title: "TEST".to_string(), url: "https://github.com/test/testie".to_string(), visit_count: 40 };
        let parent = RustHistoryItem { title: "TST".to_string(), url: "https://github.com".to_string(), visit_count: 3 };


        let baseurl_depth_lists = BTreeMap::from([
                                                 (1, vec![ &parent ])
        ]);
        let r = find_parent_item(&hist_item, &baseurl_depth_lists, None);

        debug_assert_eq!(r, Some((&parent, &hist_item)))
    }

    #[test]
    fn test_find_parent_with_baseurl_and_another_level() {
        let hist_item = RustHistoryItem { title: "TEST".to_string(), url: "https://github.com/test/testie/fsdja/afsdfas//".to_string(), visit_count: 40 };
        let parent = RustHistoryItem { title: "TST".to_string(), url: "https://github.com/test".to_string(), visit_count: 3 };
        let base = RustHistoryItem { title: "TST".to_string(), url: "https://github.com".to_string(), visit_count: 3 };


        let baseurl_depth_lists = BTreeMap::from([
                                                 (2, vec![ &parent ]),
                                                 (1, vec![ &base ]),
        ]);
        let r = find_parent_item(&hist_item, &baseurl_depth_lists, None);

        debug_assert_eq!(r, Some((&parent, &hist_item)))
    }

    #[test]
    /// This was occuring when a sublink would link to itself
    fn test_double_sublink_issue() {
        let hist_item = RustHistoryItem { title: "test".to_string(), url: "https://github.com/".to_string(), visit_count: 69 };

        let baseurl_depth_lists = BTreeMap::from([
                                                 (1, vec![&hist_item])
        ]);

        let r = find_parent_item(&hist_item, &baseurl_depth_lists, None);

        debug_assert_eq!(r, None)
    }


}


