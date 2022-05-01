package v1.models

import java.util.UUID.randomUUID

object UserData {
  private var users = Map[String, User]()

  def addUser(u: User) = users +=  u.id -> u
  def getUsers: Map[String, User] = users

  def getUserLastSynced(id: String): Option[String] = {
    val client: User = users.get(id).getOrElse(return None)
    Some(client.lastSynced)
  }
  def newID: String = {
    randomUUID().toString().filter(_ != '-')
  }
}
