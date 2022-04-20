package v1.models

import play.api.libs.json._

case class HistoryVisit(url: String, visits: Int)
case class User(id: Int, history: Seq[HistoryVisit])


