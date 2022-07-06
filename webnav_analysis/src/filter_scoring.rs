use crate::{RustHistoryItem, HistoryGraph};
use itertools::{self, Itertools};
use wasm_bindgen_test::console_log;

//TODO: Create a singleton struct to story information that will not change. Should speed up greatly

/// Returns the match score from a filter to a function in the form of ((pure text match score),
/// (visit count + graph edges))
pub fn filter_match_score(filter: &String, history_graph: &HistoryGraph, history_item: &RustHistoryItem) -> (i32, i32) {
    let filter_lowercase = filter.to_lowercase();
    let filter_list = filter_lowercase.split(" ").collect_vec();

    let history_title_lowercase = history_item.title.to_lowercase();
    let history_title_list = history_title_lowercase.split(" ").collect_vec();





    let matches = matches(&filter_list, &history_title_list);

    // console_log!("{filter} {:?} {:?}", history_item, matches);

    // The score for pure text matches
    let score1: i32 = matches.iter()
        .fold(0, |acc, m| {
            acc + (m.len() ^ 2) as i32
        });

    // console_log!("Score1: {score1}");


    let edges = match history_graph.get_edges(&history_item) {
        Some(x) => x.len(),
        None => 0
    };

    // console_log!("{:?}", edges);

    // let score2 = edges as i32 + history_item.visit_count;
    let score2 = edges as i32;

    // console_log!("Score2: {score2}");

    (score1, score2)
}




/// Finds all possible sublists of filter_list (in all orders) and matches them sublists of
/// history_title_list
fn matches<'a>(filter_list: &'a Vec<&str>, history_title_list: &'a Vec<&str>) -> Vec<Vec<&'a str>> {
    // Generating a list of possible sublists, and substrings of words to build better search matches

    let all_filter_permutations = (1..=filter_list.len()) // just sorry
        .flat_map(|l| {
            filter_list.into_iter() // TODO: Dont do this.... 
                .permutations(l)
                .map(|w| w.into_iter().map(|w| *w).collect_vec()) // TODO: FIX FIX FIX FIX TRASH AF
        })
        .collect_vec();

    let filter_subsub_lists = 
        all_filter_permutations.into_iter()
        .chain(word_partitions(filter_list).into_iter().map(|w| vec![w])) // TODO: This is probably bad
        .collect_vec();

    println!("Filter: {:?}", filter_subsub_lists);

    // Generating a list of sliding window of all possible lengths <= len of history title
    let mut history_title_sub_lists = Vec::new();
    for i in 0..=history_title_list.len() {
        for j in 0..=history_title_list.len()-i {
            history_title_sub_lists.push(history_title_list.get(j..i+j).expect("......"));
        }
    }
    println!("History: {:?}", history_title_sub_lists);


    // Getting intersections of produced lists
    filter_subsub_lists.iter()
        .fold(Vec::new(), |mut v, i| {
            if history_title_sub_lists.contains(&i.as_slice()) {
                v.push(i.to_owned()); // TODO: This is also probably bad
                v
            } else {
                v
            }
        })
}


/// Take a list of words from filter split at every space, and returs all substrings of all words
fn word_partitions<'a>(filter_list: &'a Vec<&str>) -> Vec<&'a str> {
    filter_list
        .iter()
        .flat_map(|word| {
            let mut word_partitions: Vec<&str> = Vec::new();

            // Sliding through partitions of the word to get all possible substrings
            for i in 3..=word.len() { // SHould be 3 because, who needs substring shorter (Abbreviations of words)
                for j in 0..=word.len()-i {
                    word_partitions.push(word.get(j..i+j).expect("Opps.."));
                }
            }

            word_partitions
        })
        .collect()
}





#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_word_partitions() {
        let test: Vec<&str> = vec!["This", "is", "an", "example"].into_iter().collect();
        let result = vec!["Thi", "his", "This", "exa", "xam", "amp", "mpl",  "ple", "exam", "xamp", "ampl", "mple", "examp",  "xampl", "ample", "exampl", "xample", "example"];
        assert_eq!(word_partitions(&test), result);
    }

    #[test]
    fn test_matches() {
        let s1 = "precalc email from".split(" ").collect_vec();
        let s2 = "email from pre".split(" ").collect_vec();

        let r = vec![vec!["email"], vec!["from"], vec!["email", "from"]];

        let matches = matches(&s1, &s2);  

        println!("{:?}", matches);


        debug_assert!(r.iter().map(|x| matches.contains(x)).all(|x| x))
    }

}
