package v1

import javax.inject.Inject
import play.api.mvc._
import play.api.libs.json.{JsError, JsSuccess, Json}

import v1.models.JsonConverters._
import v1.models._


class HomeController @Inject() (cc: ControllerComponents) extends AbstractController(cc) {
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

  def newUser = Action {
    // Creating the ID and adding to the user database
    val id: String = UserData.newID
    UserData.addUser(User(id, IndexedSeq[HistoryVisit](), "0"))

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

  case class syncUserJson(id: String, history: Seq[HistoryVisit])
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
              user.lastSynced = r.history(r.history.length - 1).time
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
    // Check that user exists
    // Check that the last synced date is correct
    //
}
