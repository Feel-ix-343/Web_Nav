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
    UserData.addUser(User(id, Seq[HistoryVisit](), "0"))

    // Returning the ID to the client for future api calls related directly to them
    Ok(Json.toJson(UserData.newID))
  }

  def getLastSynced(id: String) = Action {
    UserData.getUser(id) match {
      case Some(u) => Ok(Json.toJson(u.lastSynced))
      case None => Ok(Json.toJson("User does not exist"))
    }
  }

  def syncUser(id: String) = TODO
    // Check that user exists
    // Check that the last synced date is correct
    //
}
