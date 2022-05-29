package v1.models

case class HistoryResponse(items: Seq[HistoryVisit])
object HistoryAnalyzation {
  def handleDupURLs(history: Seq[HistoryVisit]): Seq[HistoryVisit] = {
    // Do soem kind of analyzation. Need to do some research for this step
    // Just going to start it off simple

    // This relys on the most recent hisotry count to be correct
    history.zipWithIndex.foldRight(Seq[HistoryVisit]())((zip, newSeq) => {
      val historyVisit = zip._1
      val index = zip._2
      if (!history.drop(index + 1).exists(followingHist => historyVisit.url == followingHist.url)) newSeq.prepended(historyVisit)
      else newSeq
    })

      }
  def analyzeHistorySimple(user: User, input: String): HistoryResponse = {
    val history = handleDupURLs(user.history)

    val filtered = history.filter(historyVisit => 
        historyVisit.title.contains(input) || 
        historyVisit.url.contains(input)) // Replace this with a method that will check if most of the string is containted, but could me missspelled

    val sorted = filtered.sortWith((h1, h2) => h1.visitCount >= h2.visitCount)

    HistoryResponse(sorted)
  }
}
