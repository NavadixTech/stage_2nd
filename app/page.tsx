"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

interface Team {
  id: string
  name: string
  points: number
  color: string
}

export default function HomePage() {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams")
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams))
    }
  }, [])

  // Trier les équipes par points (décroissant)
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points)

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "border-yellow-500 bg-yellow-50"
      case 1:
        return "border-gray-400 bg-gray-50"
      case 2:
        return "border-amber-600 bg-amber-50"
      default:
        return "border-border"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Classement des Équipes</h1>
          <p className="text-gray-600">Tableau de bord en temps réel</p>
        </div>

        {teams.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">Aucune équipe créée pour le moment</p>
              <p className="text-sm text-gray-400 mt-2">Aucune équipe n'a encore été créée</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedTeams.map((team, index) => (
              <Card key={team.id} className={`transition-all hover:shadow-lg ${getRankColor(index)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12">{getRankIcon(index)}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: team.color }}
                          />
                          <span className="text-sm text-gray-500">Équipe {team.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {team.points} pts
                      </Badge>
                      {index === 0 && team.points > 0 && (
                        <p className="text-sm text-yellow-600 font-medium mt-1">🥇 En tête !</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
