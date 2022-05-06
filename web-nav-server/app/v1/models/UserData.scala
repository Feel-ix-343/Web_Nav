package v1.models

import java.util.UUID.randomUUID

import play.api.libs.json._

case class HistoryVisit(url: String, visits: Int)
case class User(id: String, history: Seq[HistoryVisit], lastSynced: String)

object UserData {
  private var users = Map[String, User]()

  def addUser(u: User) = users += u.id -> u
  def getUser(id: String): Option[User] = users.get(id)

  def newID: String = {
    randomUUID().toString().filter(_ != '-')
  }
  def getUsers: Map[String, User] = users
}
