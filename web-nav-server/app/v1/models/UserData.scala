package v1.models

object UserData {
  private var users = Map[Int, User]()
  def addUser(u: User) = users +=  u.id -> u
  def getUsers: Map[Int, User] = users
}
