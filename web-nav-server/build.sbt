 name := """Web-Nav Server"""
organization := "server"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.8"

libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test
libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.12" % "test"

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "server.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "server.binders._"
