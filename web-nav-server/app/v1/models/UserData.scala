package v1.models

object UserData {
  private var users = Map[Int, User]()
  def addUser(u: User) = users +=  u.id -> u
  def getUsers: Map[Int, User] = users
  def nextId: Int = {
    if (users.size == 0) return 0
    else users.toList(users.size - 1)._1 + 1
  }
}
