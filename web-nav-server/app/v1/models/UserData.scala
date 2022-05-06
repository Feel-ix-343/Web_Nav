package v1.models

import java.util.UUID.randomUUID

object UserData {
  private var users = Map[String, User]()

  def addUser(u: User) = users += u.id -> u
  def getUser(id: String): Option[User] = users.get(id)

  def newID: String = {
    randomUUID().toString().filter(_ != '-')
  }

  def getUsers: Map[String, User] = users
}
