package v1.models

import play.api.libs.json._

object JsonConverters {
  implicit val historyReads = Json.reads[HistoryVisit]
  implicit val UserReads = Json.reads[User]

  implicit val historyWrites = Json.writes[HistoryVisit]
  implicit val UserWrites = Json.writes[User]
}
