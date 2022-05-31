package v1.models

import views.html.defaultpages.todo

case class HistoryResponse(items: Seq[HistoryVisit])
object HistoryAnalyzation {
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
  def analyzeHistorySimple(user: User, input: String): HistoryResponse = {
    val history = handleDupURLs(user.history)
    val inputLower = input.toLowerCase

    val sorted = history.sortBy(h => {
      (
        h.title.toLowerCase.contains(inputLower.toLowerCase),
        h.url.toLowerCase.contains(inputLower),
        inputLower.split(" ").count(h.title.toLowerCase.contains(_)),
        inputLower.split(" ").count(h.url.toLowerCase.contains(_)),
        h.visitCount,
        )
    })(Ordering.Tuple5(
      Ordering.Boolean.reverse,
      Ordering.Boolean.reverse,
      Ordering.Int.reverse,
      Ordering.Int.reverse,
      Ordering.Int.reverse,
      ))

    HistoryResponse(sorted.slice(0, 10))
  }
  // TODO: def getUserPaths = todo
}
