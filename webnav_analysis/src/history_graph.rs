
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use crate::HistoryItem;


use serde::{Serialize, Deserialize};


#[derive(Debug, Serialize, Deserialize)]
pub struct HistoryGraph {
    pub data: HashMap<HistoryGraphItem, Vec<HistoryGraphItem>>
}


#[derive(Debug, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct HistoryGraphItem {
    pub title: String,
    pub url: String
}





impl HistoryGraph {
    pub fn new(history_arr: Vec<HistoryItem>) -> HistoryGraph { // TODO: Make sure these are just bindings and not a full copy in js
        let grouped_by_baseurl: HashMap<String, Vec<&HistoryItem>> = history_arr.iter()
            .fold(HashMap::new(), |mut map, history_item| {
                let baseurl = &url_path_list(&history_item.url())[0];
                let basegroup = map.entry(baseurl.to_owned()).or_insert(vec![]);
                basegroup.push(history_item);
                map
            });

        let grouped_by_baseurl_with_depths: HashMap<&String, HashMap<u32, Vec<&HistoryItem>>> = grouped_by_baseurl.iter()
            .map(|(baseurl, history_items)| {
                (baseurl, history_items.iter()
                    .fold(HashMap::new(), |mut map, history_item| {
                        let depth = url_path_list(&history_item.url()).len() as u32;
                        let depth_group = map.entry(depth).or_insert(vec![]);
                        depth_group.push(*history_item);
                        map
                    }))
            })
            .collect();

        let base_graphs: HashMap<&String, Vec<(&HistoryItem, &HistoryItem)>> = grouped_by_baseurl.iter()
            .map(|(base, history_items)| {
                let base_with_depths = &grouped_by_baseurl_with_depths[base];
                (base, base_with_links(base_with_depths, history_items))
            })
            .collect();

        let all_rules: Vec<&(&HistoryItem, &HistoryItem)> = base_graphs.values().flatten().collect();

        HistoryGraph {
            data: all_rules.iter()
                .fold(HashMap::new(), |mut map, (parent, child)| {
                    let parent_item = HistoryGraphItem {
                        title: parent.title(),
                        url: parent.url()
                    };
                    let child_item = HistoryGraphItem {
                        title: child.title(),
                        url: child.url()
                    };
                    let parent_children = map.entry(parent_item).or_insert(vec![]);
                    parent_children.push(child_item);
                    map
                })
        }
    }
    pub fn get_edges(&self, vertex: HistoryGraphItem) -> Option<&Vec<HistoryGraphItem>> {
        self.data.get(&vertex)
    }


}



// TODO: better performance
fn url_path_list(url: &String) -> Vec<String> {
    let mut url_simplified = url
        .replacen("https://", "", 1)
        .replacen("http://", "", 1);

    if &url_simplified[url_simplified.len()-1..] == "/" {
        url_simplified.remove(url_simplified.len()-1);
    };

    url_simplified.split("/").map(|s| s.to_owned()).collect()
}




/// Searches recursively through a map of baseurl depth lists to find the parent hist item (based
/// on the url) for the given hist item. Returns a tuple (parent item found, inputted_history_item)
fn find_parent_item<'a>(hist_item: &'a HistoryItem, 
                        baseurl_depth_lists: &'a HashMap<u32, Vec<&HistoryItem>>,
                        depth_option: Option<&u32>) -> (&'a HistoryItem, &'a HistoryItem) {

    let hist_item_url_list = url_path_list(&hist_item.url()); // Doing this Earlier than with `parent` to set depth if none

    let hist_url_list_len = hist_item_url_list.len() as u32;
    let depth = depth_option.unwrap_or(&hist_url_list_len);
    

    let depths: Vec<&u32> = baseurl_depth_lists.keys().collect();
    let min_depth: &u32 = depths.iter().min().unwrap();
    if depth <= min_depth {
        (baseurl_depth_lists[min_depth][0], hist_item)

    } else {
            // TODO: && is just wierd, I think?
        if depths.contains(&&(depth - 1)) { // The possible parent depth (depth - 1) needs to exist
                                            
            // Checking if the parent depth contains a parent hist item match
            for possible_par_hist_item in baseurl_depth_lists[&(depth-1)].as_slice() {
                let parent_url_list = url_path_list(&possible_par_hist_item.url());

                let hist_item_url_list_drop_last = &hist_item_url_list[..hist_item_url_list.len()-1];

                if hist_item_url_list_drop_last == parent_url_list {
                    return (possible_par_hist_item, hist_item)
                }
            }
        }
        return find_parent_item(&hist_item, &baseurl_depth_lists, Some(&(depth-1)))
    }
}

fn base_with_links<'a>(baseurl_depth_lists: &'a HashMap<u32, Vec<&HistoryItem>>, base_hist_items: &'a Vec<&HistoryItem>) -> Vec<(&'a HistoryItem, &'a HistoryItem)> {
    base_hist_items.iter()
        .fold(Vec::new(), |mut graph, history_item| { 
            graph.push(find_parent_item(*history_item, baseurl_depth_lists, None));
            graph
         })
}




#[cfg(test)]
pub mod tests {
    use wasm_bindgen_test::wasm_bindgen_test;

    use super::*;

    #[test]
    fn url_list_is_correct() {
        let url = "https://github.com/this/is/a/test/".to_string();

        let expected_list = vec!["github.com","this","is","a","test"];

        debug_assert_eq!(url_path_list(&url),expected_list)
    }



    // #[test]
    // #[wasm_bindgen_test]
    // fn test_find_parent() {
    //     let h1 = Some(new_hist_item("github.com".to_string()));

    //     debug_assert!(h1 != None)
    // }
}






