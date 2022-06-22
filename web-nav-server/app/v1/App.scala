package v1

import javax.inject.Inject
import play.api.mvc._
import play.api.libs.json.{JsError, JsSuccess, Json}

import v1.models.JsonConverters._
import v1.models._
import views.html.helper.input
import views.html.defaultpages.badRequest
import play.api.libs.json.JsValue
import play.api.libs.json.OWrites
import play.api.libs.json.Reads
import com.fasterxml.jackson.annotation.JsonValue

import java.nio.file.{Paths, Files}
import java.nio.charset.StandardCharsets


case class SyncUserJson(id: String, history: Seq[HistoryVisit], time: Long)
case class SearchRequest(id: String, input: String)

class App @Inject() (cc: ControllerComponents) extends AbstractController(cc) {
  private def useJson(action: JsValue => Result)(implicit request: Request[AnyContent]): Result = 
    request.body.asJson.map(action(_))
      .getOrElse(BadRequest("Need to include JSON body"))

  private def parseJson[T](action: T => Result)(implicit body: JsValue, reads: Reads[T]): Result = {
    Json.fromJson[T](body) match {
      case JsSuccess(r, _) => action(r)
      case JsError(_) => BadRequest("Bad json request")
    }
  }

  def index = Action {
    Ok("Hello user")
  }

  def newUser = Action { // TODO: handle possibel case where user already exists
    // Creating the ID and adding to the user database
    val id: String = UserData.newID
    UserData.addUser(User(id, IndexedSeq[HistoryVisit](), 0))

    // Returning the ID to the client for future api calls related directly to them
    Ok(Json.toJson(id))
  }

  def getLastSynced(id: String) = Action {
    UserData.getUser(id) match {
      // Last synced is updated by the syncUser rest call
      case Some(u) => Ok(Json.toJson(u.lastSynced))
      case None => Ok(Json.toJson("User does not exist"))
    }
  }

  val debug = true; // TODO: Turn this off when in production
  // Files is used by tests
  def debugSyncHistory() = Action { implicit request => 
    useJson { jsval: JsValue =>
      if (debug == false) BadRequest("Not authorized")

      Files.deleteIfExists(Paths.get("debugHistory.json"))
      Files.write(Paths.get("debugHistory.json"), jsval.toString().getBytes(StandardCharsets.UTF_8))

      Ok("Debug File Written")
    }
  }

  implicit val syncUserJsonReads = Json.reads[SyncUserJson]
  implicit val syncUserJsonWrites = Json.writes[SyncUserJson]

  def syncUser() = Action { implicit request =>
    useJson { implicit jsval: JsValue => 
      parseJson[SyncUserJson] { syncUserJson: SyncUserJson =>
        UserData.getUser(syncUserJson.id) match {
          case Some(user) => {
            user.history ++= syncUserJson.history
            user.lastSynced = syncUserJson.time
            Ok(s"User $syncUserJson.id synced")
          }
          case None => BadRequest("User does not exist")
        }
      }
    }
  }

  implicit val syncSearchRequestReads = Json.reads[SearchRequest]
  implicit val syncSearchRequestWrites = Json.writes[SearchRequest]

  def getSearchOutput() = Action { implicit request => 
    useJson { implicit jsval: JsValue =>
      parseJson[SearchRequest] { search => 
          UserData.getUser(search.id) match {
            case Some(user) => Ok(Json.toJson[HistoryResponse](HistoryAnalyzation.analyzeHistorySimple(user.history, search.input)))
            case None => BadRequest("User does not exist")
          }
        }
      }
  }
}
