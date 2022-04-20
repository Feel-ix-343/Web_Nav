package v1

import javax.inject.Inject
import play.api.mvc._
import play.api.libs.json.{JsError, JsSuccess, Json}

import v1.models.JsonConverters._
import v1.models._

class HomeController @Inject() (cc: ControllerComponents) extends AbstractController(cc) {
  def index = Action {
    Ok(Json.toJson("This is an API, but, aparently, not for you!"))
  }

  def addUserData = Action { implicit request =>
    request.body.asJson.map { body =>
      Json.fromJson[User](body) match {
        case JsSuccess(ud, _) => {
          UserData.addUser(ud)
          Ok(Json.toJson(UserData.getUsers))
        }
        case e @ JsError(_) => Ok(Json.toJson(false))
      }
    }.getOrElse {
      Ok(Json.toJson("Bad"))
    }
  }
}
