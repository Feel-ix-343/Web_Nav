package v1

import javax.inject.Inject
import play.api.mvc._
import play.api.libs.json.{JsError, JsSuccess, Json}

import v1.models.JsonConverters._
import v1.models._
import views.html.helper.input


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

  case class syncUserJson(id: String, history: Seq[HistoryVisit], time: Int)
  implicit val syncUserJsonReads = Json.reads[syncUserJson]
  implicit val syncUserJsonWrites = Json.writes[syncUserJson]
  def syncUser() = Action { implicit request =>
    // Parse the body
    request.body.asJson.map { body =>
      // Parse the json into scala code
      Json.fromJson[syncUserJson](body) match {
        // Success: r is the scala object
        case JsSuccess(r, _) => {
          // TODO: Double check that the starting date is correct; not totally necessary, but could be usefull
          UserData.getUser(r.id) match {
            case Some(user) => {
              user.history ++= r.history
              user.lastSynced = r.time
              Ok(Json.toJson(user.history))
            }
            case None => Ok(Json.toJson("User does not exist"))
          }
        }
        // Failure
        case e @ JsError(_) => Ok(Json.toJson("Bad json request"))
      }
    }.getOrElse {
      Ok("Need to include a body")
    }
  }

  case class searchRequest(id: String, input: String)
  implicit val syncSearchRequestReads = Json.reads[searchRequest]
  implicit val syncSearchRequestWrites = Json.writes[searchRequest]
  def getSearchOutput() = Action { request => 
    request.body.asJson.map { body => 
      Json.fromJson[searchRequest](body) match {
        case JsSuccess(r, _) => {
          UserData.getUser(r.id) match {
            case Some(user) => {
              Ok(Json.toJson[HistoryResponse](HistoryAnalyzation.analyzeHistorySimple(user, r.input))) // TODO: Send response
            }
            case None => Ok(Json.toJson("User does not exist"))
          }
        }
        case e @ JsError(_) => Ok(Json.toJson("Bad json request"))
      }
    }.getOrElse {
      Ok("Need to include a body")
    }
  }
}
