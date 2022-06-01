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


class App @Inject() (cc: ControllerComponents) extends AbstractController(cc) {
  // Need to change this for the new user method
  // def addUserData = Action { implicit request =>
  //   request.body.asJson.map { body =>
  //     Json.fromJson[User](body) match {
  //       case JsSuccess(ud, _) => {
  //         UserData.addUser(ud)
  //         Ok(Json.toJson(UserData.getUsers))
  //       }
  //       case e @ JsError(_) => Ok(Json.toJson(false))
  //     }
  //   }.getOrElse {
  //     Ok(Json.toJson("Bad"))
  //   }
  // }

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
  def debugSyncHistory() = Action { implicit request => 
    request.body.asJson.map { body => 
      Ok("Written")
    }.getOrElse {
      BadRequest("Needs to be json")
    }
  }

  case class SyncUserJson(id: String, history: Seq[HistoryVisit], time: Long)
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

  case class SearchRequest(id: String, input: String)
  implicit val syncSearchRequestReads = Json.reads[SearchRequest]
  implicit val syncSearchRequestWrites = Json.writes[SearchRequest]

  def getSearchOutput() = Action { implicit request => 
    useJson { implicit jsval: JsValue =>
      parseJson[SearchRequest] { search => 
          UserData.getUser(search.id) match {
            case Some(user) => Ok(Json.toJson[HistoryResponse](HistoryAnalyzation.analyzeHistorySimple(user, search.input)))
            case None => BadRequest("User does not exist")
          }
        }
      }
  }

  private def useJson(action: JsValue => Result)(implicit request: Request[AnyContent]): Result = 
    request.body.asJson.map(action(_))
      .getOrElse(BadRequest("Need to include JSON body"))

  private def parseJson[T](action: T => Result)(implicit body: JsValue, reads: Reads[T]): Result = {
    Json.fromJson[T](body) match {
      case JsSuccess(r, _) => action(r)
      case JsError(_) => BadRequest("Bad json request")
    }
  }
}
