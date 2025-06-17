"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, Home, Users } from "lucide-react"

interface Team {
  id: string
  name: string
  points: number
  color: string
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"]

export default function AdminPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [newTeamName, setNewTeamName] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams")
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams))
  }, [teams])

  const createTeam = () => {
    if (!newTeamName.trim()) return

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName.trim(),
      points: 0,
      color: selectedColor,
    }

    setTeams([...teams, newTeam])
    setNewTeamName("")

    // Changer la couleur pour la prochaine équipe
    const currentIndex = COLORS.indexOf(selectedColor)
    const nextIndex = (currentIndex + 1) % COLORS.length
    setSelectedColor(COLORS[nextIndex])
  }

  const deleteTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId))
  }

  const updatePoints = (teamId: string, change: number) => {
    setTeams(teams.map((team) => (team.id === teamId ? { ...team, points: Math.max(0, team.points + change) } : team)))
  }

  const resetAllPoints = () => {
    if (confirm("Êtes-vous sûr de vouloir remettre tous les points à zéro ?")) {
      setTeams(teams.map((team) => ({ ...team, points: 0 })))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Panel Admin</h1>
            <p className="text-gray-600">Gestion des équipes et des points</p>
          </div>
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Retour au classement</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Création d'équipe */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Créer une équipe</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="teamName">Nom de l'équipe</Label>
                <Input
                  id="teamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Ex: Les Champions"
                  onKeyPress={(e) => e.key === "Enter" && createTeam()}
                />
              </div>

              <div>
                <Label>Couleur de l'équipe</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color ? "border-gray-900 scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={createTeam} className="w-full" disabled={!newTeamName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Créer l'équipe
              </Button>
            </CardContent>
          </Card>

          {/* Gestion des équipes */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestion des équipes ({teams.length})</CardTitle>
              {teams.length > 0 && (
                <Button variant="outline" size="sm" onClick={resetAllPoints}>
                  Remettre à zéro
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune équipe créée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
                        <span className="font-medium">{team.name}</span>
                        <Badge variant="secondary">{team.points} pts</Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePoints(team.id, -1)}
                          disabled={team.points === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Button size="sm" onClick={() => updatePoints(team.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>

                        <Button size="sm" variant="destructive" onClick={() => deleteTeam(team.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistiques */}
        {teams.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>📊 Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{teams.length}</div>
                  <div className="text-sm text-gray-500">Équipes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {teams.reduce((sum, team) => sum + team.points, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Points totaux</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.max(...teams.map((t) => t.points), 0)}</div>
                  <div className="text-sm text-gray-500">Score max</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {teams.length > 0
                      ? Math.round(teams.reduce((sum, team) => sum + team.points, 0) / teams.length)
                      : 0}
                  </div>
                  <div className="text-sm text-gray-500">Moyenne</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
