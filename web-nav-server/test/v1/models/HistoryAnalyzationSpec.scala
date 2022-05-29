package v1.models

import org.scalatest.flatspec.AnyFlatSpec

import v1.models._

class HistoryAnalyzationSpec extends AnyFlatSpec {
  "handleDupURLs" should "remove duplicate HistoryVisit objects and return the latest ones" in {
    var history = Seq[HistoryVisit]()
    history = history :+ HistoryVisit(1, "test", 1, "aurl", 1)

    for (_ <- 1 to 10) history :+ HistoryVisit(1, "testval2", 1, "theurl", 1)

    history = history :+ HistoryVisit(1, "testval2", 1, "theurl", 5)
    history = history :+ HistoryVisit(1, "test", 1, "aurl2", 1)
    history = history :+ HistoryVisit(1, "test", 1, "aurl3", 1)
    history = history :+ HistoryVisit(1, "test", 1, "aurl4", 1)
    history = history :+ HistoryVisit(1, "test", 1, "aurl", 2)


    val user = User("test", history, 0)

    val testNonDup = HistoryAnalyzation.handleDupURLs(user.history)

    var nonDupHistory = Seq[HistoryVisit]()
    nonDupHistory = nonDupHistory :+ HistoryVisit(1, "testval2", 1, "theurl", 5)
    nonDupHistory = nonDupHistory :+ HistoryVisit(1, "test", 1, "aurl2", 1)
    nonDupHistory = nonDupHistory :+ HistoryVisit(1, "test", 1, "aurl3", 1)
    nonDupHistory = nonDupHistory :+ HistoryVisit(1, "test", 1, "aurl4", 1)
    nonDupHistory = nonDupHistory :+ HistoryVisit(1, "test", 1, "aurl", 2)

    assert(testNonDup == nonDupHistory)
  }
}
