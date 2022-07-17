
use rayon::prelude::*;
use std::collections::BTreeMap;
use crate::RustHistoryItem;


#[derive(Debug)]
pub struct HistoryGraph {
    pub data: BTreeMap<RustHistoryItem, Vec<RustHistoryItem>>
}


impl HistoryGraph {
    pub fn new(history_arr: &Vec<RustHistoryItem>) -> HistoryGraph { 

        let grouped_by_baseurl: BTreeMap<String, Vec<&RustHistoryItem>> = history_arr
            .iter()
            .fold(BTreeMap::new(), |mut map, history_item| {
                let baseurl = &url_path_list(&history_item.url)[0];
                let basegroup = map.entry(baseurl.to_owned()).or_insert(vec![]);
                basegroup.push(history_item);
                map
            });

        let grouped_by_baseurl_with_depths: BTreeMap<&String, BTreeMap<u32, Vec<&RustHistoryItem>>> = grouped_by_baseurl
            .par_iter()
            .map(|(baseurl, history_items)| {
                (baseurl, history_items
                    .iter()
                    .fold(BTreeMap::new(), |mut map, &history_item| {
                        let depth = url_path_list(&history_item.url).len() as u32; // TODO: Optimize
                        let depth_group = map.entry(depth).or_insert(vec![]);
                        depth_group.push(history_item);
                        map
                    }))
            })
            .collect();

        // A graph rule is something like Link -> Link, or in this case (Link, Link). I did my modeling in mathematica, and this is how it is
        let baseurl_graph_rules: BTreeMap<&String, Vec<(&RustHistoryItem, &RustHistoryItem)>> = grouped_by_baseurl
            .par_iter()
            .map(|(base, history_items)| {
                let base_with_depths = &grouped_by_baseurl_with_depths[base];
                (base, base_with_links(base_with_depths, history_items))
            })
            .collect();

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
fn find_parent_item<'a>(hist_item: &'a RustHistoryItem, 
                        baseurl_depth_lists: &'a BTreeMap<u32, Vec<&RustHistoryItem>>,
                        depth_option: Option<&u32>) -> (&'a RustHistoryItem, &'a RustHistoryItem) {

    let hist_item_url_list = url_path_list(&hist_item.url); // Doing this Earlier than with `parent` to set depth if none

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
                let parent_url_list = url_path_list(&possible_par_hist_item.url);

                let hist_item_url_list_drop_last = &hist_item_url_list[..(*depth as usize)-1];
                println!("{:?}", parent_url_list);
                println!("{:?}", hist_item_url_list_drop_last);

                if hist_item_url_list_drop_last == parent_url_list {
                    return (possible_par_hist_item, hist_item)
                }
            }
        }
        return find_parent_item(&hist_item, &baseurl_depth_lists, Some(&(depth-1)))
    }
}

fn base_with_links<'a>(
    baseurl_depth_lists: &'a BTreeMap<u32, Vec<&RustHistoryItem>>,
    base_hist_items: &'a Vec<&RustHistoryItem>
    ) -> Vec<(&'a RustHistoryItem, &'a RustHistoryItem)> {
    base_hist_items
        .iter()
        .fold(Vec::new(), |mut graph, &history_item| { 
            graph.push(find_parent_item(history_item, baseurl_depth_lists, None));
            graph
         })
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

        debug_assert_eq!(r, (&parent, &hist_item))
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

        debug_assert_eq!(r, (&parent, &hist_item))
    }

}










