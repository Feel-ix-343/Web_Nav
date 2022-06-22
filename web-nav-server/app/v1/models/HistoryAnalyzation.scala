package v1.models

import views.html.defaultpages.todo

case class HistoryResponse(items: Seq[HistoryVisit])
object HistoryAnalyzation {
  /**
    * Returns the history with duplicates removed and the newest link kept
    *
    * @param history
    * @return
    */
  def handleDupURLs(history: Seq[HistoryVisit]): Seq[HistoryVisit] = {
    // Do soem kind of analyzation. Need to do some research for this step
    // Just going to start it off simple

    // This relys on the most recent hisotry count to be correct
    history.zipWithIndex.foldRight(Seq[HistoryVisit]())((zip, newSeq) => {
      val historyVisit = zip._1
      val index = zip._2
      if (!history.drop(index + 1).exists(followingHist => historyVisit.title == followingHist.title)) newSeq.prepended(historyVisit)
      else newSeq
    })
  }
  def analyzeHistorySimple(history: Seq[HistoryVisit], input: String): HistoryResponse = {
    val historyNoDups = handleDupURLs(history)
    val inputLower = input.toLowerCase

    val historyFiltered = historyNoDups.filter(!_.title.contains("Google Search"))

    val sorted = historyFiltered.sortBy(h => {
      (
        h.title.toLowerCase.contains(inputLower),
        inputLower.split(" ").count(h.title.toLowerCase.contains(_)),
        (for (i <- 1 to inputLower.length()) yield {
          inputLower.sliding(i).foldLeft(0) {(score, word) =>  
            if (h.title.toLowerCase.contains(word)) Math.pow(i, 2).toInt else 0 
          }
        }).sum,
        h.visitCount,
  )
    })(Ordering.Tuple4(
      Ordering.Boolean.reverse,
      Ordering.Int.reverse,
      Ordering.Int.reverse,
      Ordering.Int.reverse,
      ))

    HistoryResponse(sorted.slice(0, 10))
  }
  // TODO: def getUserPaths = todo
}
